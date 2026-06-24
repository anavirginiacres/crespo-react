import type { CartItem } from "@/context/CartContext";
import { CONTACT_EMAIL } from "@/lib/contact";

export const QUOTE_EMAIL_SUBJECT = "Solicitud de presupuesto - FF Crespo";

export function formatCartQuoteMessage(items: CartItem[]): string {
  if (items.length === 0) {
    return "Hola, quisiera solicitar presupuesto por productos de FF Crespo.";
  }

  const lines = [
    "Hola, quisiera solicitar presupuesto por los siguientes productos:",
    "",
  ];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   Cantidad: ${item.quantity}`);

    if (item.options.color) {
      lines.push(`   Color: ${item.options.color}`);
    }

    if (item.options.materials) {
      lines.push(`   Material: ${item.options.materials}`);
    }

    if (item.options.measures) {
      lines.push(`   Medida: ${item.options.measures}`);
    }

    if (item.options.details) {
      lines.push(`   Observaciones: ${item.options.details}`);
    }

    lines.push("");
  });

  lines.push("Aguardo su respuesta. ¡Gracias!");

  return lines.join("\n");
}

export function buildQuoteMailtoUrl(items: CartItem[]): string {
  const body = formatCartQuoteMessage(items);

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(QUOTE_EMAIL_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export function buildQuoteWhatsAppUrl(items: CartItem[], phone: string): string {
  const text = formatCartQuoteMessage(items);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
