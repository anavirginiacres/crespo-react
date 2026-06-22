require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Categorías
  const cat1 = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Accesorios", icon: "bag" },
  });
  const cat2 = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Hogar", icon: "home" },
  });

  // Subcategorías (dependen de categorías)
  const sub1 = await prisma.subcategory.upsert({
    where: { id: 1 },
    update: {},
    create: { id_category: cat1.id, name: "Bolsos" },
  });
  const sub2 = await prisma.subcategory.upsert({
    where: { id: 2 },
    update: {},
    create: { id_category: cat1.id, name: "Cinturones" },
  });
  const sub3 = await prisma.subcategory.upsert({
    where: { id: 3 },
    update: {},
    create: { id_category: cat2.id, name: "Decoración" },
  });

  // Productos de ejemplo
  const prod1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id_category: cat1.id,
      id_subcategory: sub1.id,
      name: "Bolso tejido",
      caption: "Bolso artesanal",
      materials: "Yute, algodón",
      quantity: "1",
      tags: "bolso, tejido, artesanal",
    },
  });
  const prod2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id_category: cat2.id,
      id_subcategory: sub3.id,
      name: "Jarrón cerámica",
      caption: "Jarrón hecho a mano",
      materials: "Cerámica",
      details: "Hecho a mano. Colores surtidos.",
      tags: "deco, cerámica",
    },
  });

  // Imagen de ejemplo para el primer producto
  await prisma.image.upsert({
    where: { id: 1 },
    update: {},
    create: { id_product: prod1.id, src: "/img/bolso-1.jpg" },
  });

  console.log("Seed completado: categorías, subcategorías, productos e imagen de ejemplo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
