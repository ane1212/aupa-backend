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
        { name: "food", description: "Food", icon: "Utensils" },
        { name: "culture", description: "Culture", icon: "Building2" },
        { name: "nature", description: "Nature", icon: "TreePine" },
        { name: "bars", description: "Bars", icon: "Wine" },
        { name: "local_favorites", description: "Local favorites", icon: "Bookmark" },
        { name: "shopping", description: "Shopping", icon: "Store" },
        { name: "coffee_shops", description: "Coffee Shops", icon: "Coffee" },
        { name: "walking_tours", description: "Walking Tours", icon: "Map" },
        { name: "family_friendly", description: "Family Friendly", icon: "Users" },
        { name: "vegetarian_vegan", description: "Vegetarian/Vegan", icon: "Leaf" },
        { name: "history", description: "History", icon: "Landmark" },
        { name: "festivals_events", description: "Festivals/Events", icon: "Calendar" },
        { name: "beaches", description: "Beaches", icon: "Parasol" },
        { name: "nightlife", description: "Nightlife", icon: "Eclipse" },
        { name: "budget_friendly", description: "Budget Friendly", icon: "DollarSign" },
        { name: "oneday", description: "One-day", icon: "CalendarDays" },
        { name: "threedays", description: "2-3 days", icon: "CalendarClock" },
        { name: "oneweek", description: "4-7 days", icon: "Clock" },
        { name: "longstay", description: "More", icon: "CalendarRange" },
        { name: "solo", description: "Solo", icon: "User" },
        { name: "partner", description: "Partner", icon: "UserCircle" },
        { name: "friends", description: "Friends", icon: "Users2" },
        { name: "family", description: "Family", icon: "Users" },
      ],
      { validate: true, transaction }
    );

    const getCategory = (name: string) =>
      categories.find((c) => c.name === name)!;

    const food = getCategory("food");
    const culture = getCategory("culture");
    const bars = getCategory("bars");
    const nightlife = getCategory("nightlife");

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
          title: "Afterwork de Pintxos en el Casco Viejo",
          description: "Cata informal de pintxos clásicos con txakoli y ambientación local.",
          date: new Date("2026-06-12"),
          startTime: "19:30:00",
          endTime: "22:00:00",
          image: "https://static.eldiario.es/clip/ee1a6976-9563-4d20-a835-249d814558ec_16-9-aspect-ratio_default_0.jpg",
          price: 22.5,
          capacity: 35,
          address: "Barrenkale Barrena, 8, 48005 Bilbao",
          latitude: 43.2579,
          longitude: -2.9248,
          localId: local1.id,
          categoryId: food.id,
          active: true,
        },
        {
          title: "Sesión Jazz en Muelle",
          description: "Concierto íntimo con formato trío y copas en un espacio cultural del centro.",
          date: new Date("2026-06-14"),
          startTime: "20:00:00",
          endTime: "22:30:00",
          image: "https://verybilbao.com/wp-content/uploads/2024/07/verybilbao_lugares_recomendados_las_mejores_centros_musicales_musica_directo_locales_bilbao_bilbaina_jazz_bjc1.jpg",
          price: 18.0,
          capacity: 80,
          address: "Calle Ripa, 3, 48001 Bilbao",
          latitude: 43.2627,
          longitude: -2.9308,
          localId: local2.id,
          categoryId: culture.id,
          active: true,
        },
        {
          title: "Cata de Vermuts y Conservas",
          description: "Maridaje de vermuts locales con selección de conservas y encurtidos.",
          date: new Date("2026-06-18"),
          startTime: "18:30:00",
          endTime: "20:00:00",
          image: "https://yendoporlavida.com/wp-content/uploads/2023/05/Taska-Beltz-de-Bilbao.jpg",
          price: 16.5,
          capacity: 24,
          address: "Plaza Nueva, 2, 48005 Bilbao",
          latitude: 43.2574,
          longitude: -2.9240,
          localId: local1.id,
          categoryId: bars.id,
          active: true,
        },
        {
          title: "Noche de Monólogos en Indautxu",
          description: "Show de humor con cómicos locales y consumo mínimo incluido.",
          date: new Date("2026-06-19"),
          startTime: "21:00:00",
          endTime: "23:00:00",
          image: "https://res.cloudinary.com/hello-tickets/image/upload/c_limit,f_auto,q_auto,w_768/v1676577941/post_images/Bilbao-315/Night/10162631205_99e8a3e3ed_o_Cropped.jpg",
          price: 12.0,
          capacity: 60,
          address: "Poza Lizentziatuaren Kalea, 48, 48011 Bilbao",
          latitude: 43.2614,
          longitude: -2.9411,
          localId: local2.id,
          categoryId: nightlife.id,
          active: true,
        },
        {
          title: "Brunch Musical junto a la Ría",
          description: "Sesión de DJ suave con brunch de producto local y vistas a la ría.",
          date: new Date("2026-06-21"),
          startTime: "11:30:00",
          endTime: "14:30:00",
          image: "https://gaztea.eus/content/dam/edukiak/irudiak/2025/06/29/bbk-ria-kontzertuak-efe.jpg",
          price: 29.0,
          capacity: 50,
          address: "Uribitarte Pasealekua, 12, 48001 Bilbao",
          latitude: 43.2662,
          longitude: -2.9332,
          localId: local1.id,
          categoryId: food.id,
          active: true,
        },
        {
          title: "Presentación de Libro y Vermut",
          description: "Encuentro con autor local, charla breve y aperitivo en sala-bar.",
          date: new Date("2026-06-24"),
          startTime: "19:00:00",
          endTime: "20:30:00",
          image: "https://vermutmiro.com/wp-content/uploads/2026/04/Presentacio-Llibre-Miro.jpg",
          price: 8.0,
          capacity: 30,
          address: "Alameda Recalde, 4, 48009 Bilbao",
          latitude: 43.2638,
          longitude: -2.9376,
          localId: local2.id,
          categoryId: culture.id,
          active: true,
        },
        {
          title: "Tardeo Indie en el Puerto Viejo",
          description: "Música indie, pintxos y ambiente de tarde en local de barrio.",
          date: new Date("2026-06-27"),
          startTime: "18:00:00",
          endTime: "23:30:00",
          image: "https://s3.elespanol.com/2026/02/16/actualidad/1003744131668_261446999_1706x960.jpg?fmt=jpeg",
          price: 10.0,
          capacity: 90,
          address: "Calle del Muelle, 7, 48003 Bilbao",
          latitude: 43.2559,
          longitude: -2.9272,
          localId: local2.id,
          categoryId: nightlife.id,
          active: true,
        },
        {
          title: "Cata de Cervezas Artesanas",
          description: "Degustación guiada de cervezas locales con explicación de estilos y proceso.",
          date: new Date("2026-06-28"),
          startTime: "19:30:00",
          endTime: "21:00:00",
          image: "https://shop.beebeer.es/568-large_default/hi-bee.jpg",
          price: 19.5,
          capacity: 28,
          address: "Lersundi Kalea, 8, 48009 Bilbao",
          latitude: 43.2632,
          longitude: -2.9394,
          localId: local1.id,
          categoryId: food.id,
          active: true,
        },
        {
          title: "Noche de Salsa en Abando",
          description: "Clase abierta y baile social con DJ latino hasta medianoche.",
          date: new Date("2026-07-02"),
          startTime: "21:30:00",
          endTime: "00:30:00",
          image: "https://estaticosgn-cdn.deia.eus/clip/b623ce34-56b1-4537-8353-dff50fd562cf_source-aspect-ratio_default_0.jpg",
          price: 14.0,
          capacity: 70,
          address: "Colón de Larreátegui Kalea, 34, 48009 Bilbao",
          latitude: 43.2621,
          longitude: -2.9322,
          localId: local2.id,
          categoryId: nightlife.id,
          active: true,
        },
        {
          title: "Encuentro de Cantautores",
          description: "Microfestival acústico con artistas emergentes de Bizkaia.",
          date: new Date("2026-07-04"),
          startTime: "20:30:00",
          endTime: "23:30:00",
          image: "https://www.plazanueva.com/asset/thumbnail,1280,720,center,center/media/plazanueva/images/2024/12/19/2024121910343347355.jpg",
          price: 17.0,
          capacity: 65,
          address: "Calle Ripa, 3, 48001 Bilbao",
          latitude: 43.2627,
          longitude: -2.9308,
          localId: local2.id,
          categoryId: culture.id,
          active: true,
        },
        {
          title: "Ronda Gastronómica de Barrio",
          description: "Ruta guiada por bares con especialidades de temporada y postre final.",
          date: new Date("2026-07-06"),
          startTime: "19:00:00",
          endTime: "22:30:00",
          image: "https://bilbaoalacarta.com/files/2014/07/banner_pimtxos_bilbao.jpg",
          price: 27.5,
          capacity: 40,
          address: "Mercado de la Ribera, 48005 Bilbao",
          latitude: 43.2570,
          longitude: -2.9254,
          localId: local1.id,
          categoryId: food.id,
          active: true,
        },
        {
          title: "Fiesta de DJs al Atardecer",
          description: "Sesión electrónica suave para cerrar el día con cócteles y terraza.",
          date: new Date("2026-07-09"),
          startTime: "19:00:00",
          endTime: "00:00:00",
          image: "https://img.magnific.com/fotos-premium/dj-mezclando-fiesta-playa-al-atardecer-vacaciones-verano-al-aire-libre-disc-jockey-manos-tocando-musica_1031327-17.jpg",
          price: 20.0,
          capacity: 100,
          address: "Calle Ripa, 3, 48001 Bilbao",
          latitude: 43.2627,
          longitude: -2.9308,
          localId: local2.id,
          categoryId: nightlife.id,
          active: true,
        },
      ],
      { validate: true, transaction }
    );

    const [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10, event11, event12] = events;

    await Favorite.bulkCreate(
      [
        { userId: user3.id, eventId: event1.id },
        { userId: user4.id, eventId: event2.id },
      ],
      { validate: true, transaction }
    );

    await Preference.bulkCreate(
      [
        { userId: user3.id, categoryId: food.id },
        { userId: user4.id, categoryId: culture.id },
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
          message: "Tu plaza para Afterwork de Pintxos en el Casco Viejo está confirmada.",
          read: false,
          type: NotificationType.SYSTEM,
        },
        {
          userId: user4.id,
          title: "Nuevo evento musical",
          message: "Se ha publicado una sesión jazz en Bilbao.",
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