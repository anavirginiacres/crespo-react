import { prisma } from "@/lib/prisma";
import type {
  AddImagePayload,
  ChangeAction,
  CreateProductPayload,
  DeleteImagePayload,
  UpdateProductPayload,
} from "@/lib/admin/types";

function parsePayload<T>(payload: string): T {
  return JSON.parse(payload) as T;
}

export async function applyChangeRequest(
  action: ChangeAction,
  productId: number | null,
  payloadJson: string
): Promise<number | null> {
  switch (action) {
    case "CREATE_PRODUCT": {
      const payload = parsePayload<CreateProductPayload>(payloadJson);
      const product = await prisma.product.create({
        data: {
          id_category: payload.id_category,
          id_subcategory: payload.id_subcategory,
          name: payload.name,
          caption: payload.caption ?? null,
          image: payload.image ?? null,
          materials: payload.materials ?? null,
          measures: payload.measures ?? null,
          quantity: payload.quantity ?? null,
          details: payload.details ?? null,
          caution: payload.caution ?? null,
          colors: payload.colors ?? null,
          delay: payload.delay ?? null,
          tags: payload.tags ?? null,
          new_product: payload.new_product ?? false,
        },
      });

      if (payload.galleryImages?.length) {
        await prisma.image.createMany({
          data: payload.galleryImages
            .map((src) => src.trim())
            .filter(Boolean)
            .map((src) => ({
              id_product: product.id,
              src,
            })),
        });
      }

      return product.id;
    }

    case "UPDATE_PRODUCT": {
      if (!productId) {
        throw new Error("Product id is required for UPDATE_PRODUCT");
      }

      const payload = parsePayload<UpdateProductPayload>(payloadJson);

      await prisma.product.update({
        where: { id: productId },
        data: {
          ...(payload.id_category !== undefined
            ? { id_category: payload.id_category }
            : {}),
          ...(payload.id_subcategory !== undefined
            ? { id_subcategory: payload.id_subcategory }
            : {}),
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.caption !== undefined ? { caption: payload.caption } : {}),
          ...(payload.image !== undefined ? { image: payload.image } : {}),
          ...(payload.materials !== undefined
            ? { materials: payload.materials }
            : {}),
          ...(payload.measures !== undefined ? { measures: payload.measures } : {}),
          ...(payload.quantity !== undefined ? { quantity: payload.quantity } : {}),
          ...(payload.details !== undefined ? { details: payload.details } : {}),
          ...(payload.caution !== undefined ? { caution: payload.caution } : {}),
          ...(payload.colors !== undefined ? { colors: payload.colors } : {}),
          ...(payload.delay !== undefined ? { delay: payload.delay } : {}),
          ...(payload.tags !== undefined ? { tags: payload.tags } : {}),
          ...(payload.new_product !== undefined
            ? { new_product: payload.new_product }
            : {}),
        },
      });

      return productId;
    }

    case "ADD_IMAGE": {
      if (!productId) {
        throw new Error("Product id is required for ADD_IMAGE");
      }

      const payload = parsePayload<AddImagePayload>(payloadJson);

      await prisma.image.create({
        data: {
          id_product: productId,
          src: payload.src.trim(),
        },
      });

      return productId;
    }

    case "DELETE_IMAGE": {
      if (!productId) {
        throw new Error("Product id is required for DELETE_IMAGE");
      }

      const payload = parsePayload<DeleteImagePayload>(payloadJson);

      await prisma.image.delete({
        where: { id: payload.imageId },
      });

      return productId;
    }

    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

export async function submitOrApplyChange(input: {
  action: ChangeAction;
  productId?: number | null;
  payload: unknown;
  userId: number;
  userRole: "ADMIN" | "USER";
}) {
  const payloadJson = JSON.stringify(input.payload);

  if (input.userRole === "ADMIN") {
    const appliedProductId = await applyChangeRequest(
      input.action,
      input.productId ?? null,
      payloadJson
    );

    const change = await prisma.productChangeRequest.create({
      data: {
        action: input.action,
        status: "APPROVED",
        productId: appliedProductId ?? input.productId ?? null,
        payload: payloadJson,
        submittedById: input.userId,
        reviewedById: input.userId,
        reviewedAt: new Date(),
      },
    });

    return { mode: "applied" as const, change, productId: appliedProductId };
  }

  const change = await prisma.productChangeRequest.create({
    data: {
      action: input.action,
      status: "PENDING",
      productId: input.productId ?? null,
      payload: payloadJson,
      submittedById: input.userId,
    },
  });

  return { mode: "pending" as const, change, productId: input.productId ?? null };
}
