import "dotenv/config";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db";
import {
  User,
  Category,
  Local,
  Event,
  Favorite,
  Preference,
  Comment,
  Incident,
  Notification,
} from "../models";
import { UserRole, LocalStatus, IncidentStatus, NotificationType } from "../enums";

const seedAll = async () => {
  const transaction = await sequelize.transaction();

  try {
    const adminPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "adminuserpassword",
      10
    );

    const userPassword1 = await bcrypt.hash(
      process.env.USER_1_PASSWORD || "user1234",
      10
    );
    const userPassword2 = await bcrypt.hash(
      process.env.USER_2_PASSWORD || "user1234",
      10
    );
    const userPassword3 = await bcrypt.hash(
      process.env.USER_3_PASSWORD || "user1234",
      10
    );
    const userPassword4 = await bcrypt.hash(
      process.env.USER_4_PASSWORD || "user1234",
      10
    );

    const users = await User.bulkCreate(
      [
        {
          name: process.env.ADMIN_USERNAME || "admin.euskadi",
          email: process.env.ADMIN_EMAIL || "admin@euskadi-events.test",
          password: adminPassword,
          role: UserRole.SUPER_ADMIN,
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
          active: true,
        },
        {
          name: process.env.USER_1_NAME || "Ane Mendia",
          email: process.env.USER_1_EMAIL || "ane.mendia@example.com",
          password: userPassword1,
          role: UserRole.LOCAL,
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ane",
          active: true,
        },
        {
          name: process.env.USER_2_NAME || "Iker Urrutia",
          email: process.env.USER_2_EMAIL || "iker.urrutia@example.com",
          password: userPassword2,
          role: UserRole.LOCAL,
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Iker",
          active: true,
        },
        {
          name: process.env.USER_3_NAME || "Maialen Etxeberria",
          email: process.env.USER_3_EMAIL || "maialen.etxeberria@example.com",
          password: userPassword3,
          role: UserRole.USER,
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Maialen",
          active: true,
        },
        {
          name: process.env.USER_4_NAME || "Jon Aramburu",
          email: process.env.USER_4_EMAIL || "jon.aramburu@example.com",
          password: userPassword4,
          role: UserRole.USER,
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jon",
          active: true,
        },
      ],
      { validate: true, transaction }
    );

    const [admin, user1, user2, user3, user4] = users;

    const categories = await Category.bulkCreate(
      [
        {
          name: "Gastronomía",
          description: "Experiencias gastronómicas, catas y rutas culinarias.",
          icon: "utensils",
        },
        {
          name: "Música",
          description: "Conciertos, sesiones en directo y festivales.",
          icon: "music",
        },
        {
          name: "Cultura",
          description: "Actividades culturales, teatro y exposiciones.",
          icon: "landmark",
        },
      ],
      { validate: true, transaction }
    );

    const [gastronomia, musica, cultura] = categories;

    const locals = await Local.bulkCreate(
      [
        {
          name: "Ardoa Gastro Bar",
          description: "Pintxos modernos y vinos de Rioja Alavesa.",
          address: "Calle Postas 12, Vitoria-Gasteiz",
          phone: "+34 945 000 111",
          image: "https://picsum.photos/seed/ardoa/800/600",
          userId: user1.id,
          status: LocalStatus.APPROVED,
          verifiedBy: admin.id,
          verifiedAt: new Date(),
        },
        {
          name: "Kantari Taberna",
          description: "Taberna con programación musical y menú de producto local.",
          address: "Calle Mayor 8, Bilbao",
          phone: "+34 944 000 222",
          image: "https://picsum.photos/seed/kantari/800/600",
          userId: user2.id,
          status: LocalStatus.APPROVED,
          verifiedBy: admin.id,
          verifiedAt: new Date(),
        },
      ],
      { validate: true, transaction }
    );

    const [local1, local2] = locals;

    const events = await Event.bulkCreate(
      [
        {
          title: "Ruta de Pintxos de Temporada",
          description: "Recorrido por sabores locales con maridaje de txakoli.",
          date: new Date("2026-06-20"),
          startTime: "19:00:00",
          endTime: "22:30:00",
          image: "https://picsum.photos/seed/pintxos/1200/800",
          price: 28.5,
          capacity: 40,
          address: "Calle Postas 12, Vitoria-Gasteiz",
          latitude: 42.8467,
          longitude: -2.6727,
          localId: local1.id,
          categoryId: gastronomia.id,
          active: true,
        },
        {
          title: "Concierto Acústico en Taberna",
          description: "Sesión íntima con artistas locales y cena informal.",
          date: new Date("2026-07-05"),
          startTime: "21:00:00",
          endTime: "23:00:00",
          image: "https://picsum.photos/seed/concierto/1200/800",
          price: 15,
          capacity: 60,
          address: "Calle Mayor 8, Bilbao",
          latitude: 43.263,
          longitude: -2.935,
          localId: local2.id,
          categoryId: musica.id,
          active: true,
        },
        {
          title: "Cata de Quesos y Sidra",
          description: "Actividad guiada con productores de Gipuzkoa.",
          date: new Date("2026-07-18"),
          startTime: "18:30:00",
          endTime: "20:30:00",
          image: "https://picsum.photos/seed/cata/1200/800",
          price: 24,
          capacity: 30,
          address: "Donostia-San Sebastián",
          latitude: 43.3183,
          longitude: -1.9812,
          localId: local1.id,
          categoryId: gastronomia.id,
          active: true,
        },
      ],
      { validate: true, transaction }
    );

    const [event1, event2, event3] = events;

    await Favorite.bulkCreate(
      [
        { userId: user3.id, eventId: event1.id },
        { userId: user4.id, eventId: event2.id },
      ],
      { validate: true, transaction }
    );

    await Preference.bulkCreate(
      [
        { userId: user3.id, categoryId: gastronomia.id },
        { userId: user4.id, categoryId: musica.id },
      ],
      { validate: true, transaction }
    );

    await Comment.bulkCreate(
      [
        {
          userId: user3.id,
          eventId: event1.id,
          content: "Muy buena organización y producto de calidad.",
          rating: 5,
        },
        {
          userId: user4.id,
          eventId: event2.id,
          content: "Ambiente excelente y música muy cuidada.",
          rating: 4,
        },
      ],
      { validate: true, transaction }
    );

    await Incident.bulkCreate(
      [
        {
          userId: user3.id,
          eventId: event3.id,
          content: "La información del acceso podría estar más clara.",
          status: IncidentStatus.PENDING,
        },
      ],
      { validate: true, transaction }
    );

    await Notification.bulkCreate(
      [
        {
          userId: user3.id,
          title: "Reserva confirmada",
          message: "Tu plaza para Ruta de Pintxos de Temporada está confirmada.",
          read: false,
          type: NotificationType.SYSTEM,
        },
        {
          userId: user4.id,
          title: "Nuevo evento musical",
          message: "Se ha publicado un concierto acústico en tu zona.",
          read: true,
          type: NotificationType.INFO,
        },
      ],
      { validate: true, transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default seedAll;