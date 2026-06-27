require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const EDITOR_PASSWORD = process.env.ADMIN_EDITOR_PASSWORD || "editor123";
const FERNANDO_PASSWORD = process.env.ADMIN_FERNANDO_PASSWORD || "f3rn4nd0";
const TEXTIL_PASSWORD = process.env.ADMIN_TEXTIL_PASSWORD || "textil123";

async function main() {
  // Categorías
  const cat1 = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Bordados", icon: "embroidery" },
  });
  const cat2 = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "Cartelería", icon: "ads-sign-poster" },
  });
  const cat3 = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: { name: "Enmarcados", icon: "picture-frame" },
  });
  const cat4 = await prisma.category.upsert({
    where: { id: 4 },
    update: {},
    create: { name: "Estampados", icon: "tshirt-printing" },
  });
  const cat5 = await prisma.category.upsert({
    where: { id: 5 },
    update: {},
    create: { name: "Identificadores", icon: "id-card" },
  });
  const cat6 = await prisma.category.upsert({
    where: { id: 6 },
    update: {},
    create: { name: "Imprenta", icon: "multifunction-printer" },
  });
  const cat7 = await prisma.category.upsert({
    where: { id: 7 },
    update: {},
    create: { name: "Indumentaria", icon: "uniform-tie" },
  });
  const cat8 = await prisma.category.upsert({
    where: { id: 8 },
    update: {},
    create: { name: "Merchandising", icon: "merchandising" },
  });
  const cat9 = await prisma.category.upsert({
    where: { id: 9 },
    update: {},
    create: { name: "Papelería", icon: "envelope-paper" },
  });
  const cat10 = await prisma.category.upsert({
    where: { id: 10 },
    update: {},
    create: { name: "Fuerzas Seguridad", icon: "award" },
  });
  const cat11 = await prisma.category.upsert({
    where: { id: 11 },
    update: {},
    create: { name: "Sellos", icon: "rubber-stamp" },
  });
  const cat12 = await prisma.category.upsert({
    where: { id: 12 },
    update: {},
    create: { name: "Trofeos", icon: "trophy" },
  });
  const cat13 = await prisma.category.upsert({
    where: { id: 13 },
    update: {},
    create: { name: "Grabados", icon: "laser-engravings-machine" },
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
  /* const prod1 = await prisma.product.upsert({
    where: { id: 1 },
    update: { new_product: true, image: "/img/productos/bolso-1.jpg" },
    create: {
      id_category: cat1.id,
      id_subcategory: sub1.id,
      name: "Bolso tejido",
      caption: "Bolso artesanal",
      image: "/img/productos/bolso-1.jpg",
      materials: "Yute, algodón",
      quantity: "1",
      tags: "bolso, tejido, artesanal",
      new_product: true,
    },
  });
  const prod2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {
      new_product: false,
      image: "/img/productos/jarron-1.jpg",
      colors: "Blanco, Negro, Terracota",
      materials: "Cerámica, Esmaltada",
      measures: "15 cm, 20 cm",
    },
    create: {
      id_category: cat2.id,
      id_subcategory: sub3.id,
      name: "Jarrón cerámica",
      caption: "Jarrón hecho a mano",
      image: "/img/productos/jarron-1.jpg",
      materials: "Cerámica, Esmaltada",
      measures: "15 cm, 20 cm",
      colors: "Blanco, Negro, Terracota",
      details: "Hecho a mano. Colores surtidos.",
      tags: "deco, cerámica",
      new_product: false,
    },
  }); */

  // Imágenes de ejemplo (public/img/productos/)
  /* await prisma.image.upsert({
    where: { id: 1 },
    update: { src: "/img/productos/bolso-1.jpg" },
    create: { id_product: prod1.id, src: "/img/productos/bolso-1.jpg" },
  });
  await prisma.image.upsert({
    where: { id: 2 },
    update: { src: "/img/productos/jarron-1.jpg" },
    create: { id_product: prod2.id, src: "/img/productos/jarron-1.jpg" },
  });
  await prisma.image.upsert({
    where: { id: 3 },
    update: { src: "/img/productos/jarron-2.jpg" },
    create: { id_product: prod2.id, src: "/img/productos/jarron-2.jpg" },
  });
  await prisma.image.upsert({
    where: { id: 4 },
    update: { src: "/img/productos/jarron-3.jpg" },
    create: { id_product: prod2.id, src: "/img/productos/jarron-3.jpg" },
  }); */

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      role: "ADMIN",
    },
  });

  await prisma.adminUser.upsert({
    where: { username: "editor" },
    update: {},
    create: {
      username: "editor",
      passwordHash: await bcrypt.hash(EDITOR_PASSWORD, 10),
      role: "USER",
    },
  });

  await prisma.adminUser.upsert({
    where: { username: "fernando1967" },
    update: {},
    create: {
      username: "fernando1967",
      passwordHash: await bcrypt.hash(FERNANDO_PASSWORD, 10),
      role: "ADMIN",
    },
  });

  await prisma.adminUser.upsert({
    where: { username: "textil" },
    update: {},
    create: {
      username: "textil",
      passwordHash: await bcrypt.hash(TEXTIL_PASSWORD, 10),
      role: "USER",
    },
  });

  console.log(
    "Seed completado: categorías, subcategorías, productos, imágenes y usuarios admin."
  );
  console.log("Usuarios admin: admin (ADMIN), editor (USER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
