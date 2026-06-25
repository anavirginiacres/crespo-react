export type ClientContact = {
  name: string;
  phone?: string;
  email?: string;
};

const STORAGE_KEY = "crespo-client-contact";

export function isValidClientContact(
  contact: Partial<ClientContact> | null | undefined
): contact is ClientContact {
  if (!contact?.name?.trim()) return false;
  return Boolean(contact.phone?.trim() || contact.email?.trim());
}

export function getClientContact(): ClientContact | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<ClientContact>;
    if (!isValidClientContact(parsed)) return null;

    return normalizeClientContact(parsed);
  } catch {
    return null;
  }
}

export function saveClientContact(contact: ClientContact): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeClientContact(contact)));
}

export function normalizeClientContact(
  contact: Partial<ClientContact>
): ClientContact {
  const normalized: ClientContact = {
    name: contact.name?.trim() ?? "",
  };

  if (contact.phone?.trim()) {
    normalized.phone = contact.phone.trim();
  }

  if (contact.email?.trim()) {
    normalized.email = contact.email.trim();
  }

  return normalized;
}

export function formatClientContactLines(contact: ClientContact): string[] {
  const lines = ["Mis datos de contacto:", `Nombre: ${contact.name}`];

  if (contact.phone) {
    lines.push(`Teléfono: ${contact.phone}`);
  }

  if (contact.email) {
    lines.push(`Email: ${contact.email}`);
  }

  return lines;
}

export function validateClientContactForm(contact: Partial<ClientContact>): string {
  if (!contact.name?.trim()) {
    return "Ingresá tu nombre.";
  }

  if (!contact.phone?.trim() && !contact.email?.trim()) {
    return "Ingresá un teléfono o un email para que podamos contactarte.";
  }

  return "";
}
