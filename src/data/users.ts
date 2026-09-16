import { UserConfig } from '../types';

/**
 * CONFIGURACIÓN DE USUARIOS PREDEFINIDOS
 * Puedes agregar, editar o remover usuarios fácilmente aquí.
 * Cada usuario tiene sus credenciales, mensaje y tipo de animación de flores amarillas:
 * - 'petals_rain': Lluvia suave de pétalos amarillos en Canvas 60 FPS
 * - 'sunflower_bloom': Floración majestuosa de Girasol en SVG/CSS
 * - 'floating_sparkles': Flores flotantes con destellos y orbes de luz dorada
 */
export const USERS_CONFIG: UserConfig[] = [
  {
    username: 'leslie',
    password: 'Lasflores123',
    displayName: 'Leslie',
    customMessage: '«Leslie, entregarte este ramo de flores amarillas es recordarte la luz tan bella, cálida y genuina que irradias cada día. Que tu camino siempre esté colmado de felicidad, serenidad en el alma y que cada uno de tus anhelos florezca con la fuerza y el brillo más hermoso. Eres una persona sumamente especial.»',
    animationType: 'golden_bouquet',
    roleDescription: 'Efecto Leslie: Ramo radiante abriendo pétalos con destellos dorados y luciérnagas',
    avatarSeed: '💐'
  },
  {
    username: 'ashlie',
    password: 'Lasflores123',
    displayName: 'Ashlie',
    customMessage: '«Ashlie, este ramo de flores doradas representa la alegría contagiosa y la dulzura infinita que regalas a quienes te rodean. Que la vida te devuelva multiplicada toda esa magia, llenando tus días de bendiciones, sonrisas radiantes y momentos inolvidables. Te aprecio con todo el corazón.»',
    animationType: 'floating_sparkles',
    roleDescription: 'Efecto Ashlie: Ramo flotante en levitación suave mientras caen flores luminosas',
    avatarSeed: '✨'
  },
  {
    username: 'ange',
    password: 'Lasflores123',
    displayName: 'Ange',
    customMessage: '«Ange, entregarte estas flores amarillas es recordarte lo inmensamente especial que eres. Que nunca te falte la alegría, que cada día se ilumine con la calidez del sol y que tus sueños florezcan con fuerza infinita.»',
    animationType: 'golden_bouquet',
    roleDescription: 'Animación: Ramo Dorado Encantado y Luciérnagas',
    avatarSeed: '🌻'
  },
  {
    username: 'keisy',
    password: 'Lasflores123',
    displayName: 'Keisy',
    customMessage: '«Keisy, te entrego este jardín de flores amarillas con todo mi cariño sincero. Gracias por tu autenticidad, tu sonrisa y la luz tan bella que siempre transmites. Que tu vida esté llena de dicha permanente.»',
    animationType: 'spiral_vortex',
    roleDescription: 'Animación: Vórtice Galáctico de Flores Doradas',
    avatarSeed: '🌼'
  },
  {
    username: 'nata',
    password: 'Lasflores123',
    displayName: 'Nata',
    customMessage: '«Para Nata, este ramo de flores amarillas llega como un abrazo cálido y sincero. Que tu vida se colme de momentos dorados, sonrisas que iluminen el alma y una dicha inmensa en cada nuevo amanecer. Eres una persona verdaderamente única y especial.»',
    animationType: 'sunflower_bloom',
    roleDescription: 'Efecto Nata: Floración de Girasol Majestuoso en espiral dorada',
    avatarSeed: '🌻'
  },
  {
    username: 'naty',
    password: 'Lasflores123',
    displayName: 'Naty',
    customMessage: '«Naty, estas flores amarillas van para ti con todo mi cariño y admiración. Tu ternura, dulzura y buena vibra llenan cualquier lugar de calma y alegría sincera. Que la vida te regale infinitas razones para sonreír y que cada día florezcan en ti nuevas bendiciones y momentos mágicos.»',
    animationType: 'petals_rain',
    roleDescription: 'Efecto Naty: Lluvia primaveral de pétalos dorados flotantes',
    avatarSeed: '🌸'
  },
  {
    username: 'ronald',
    password: 'Lasflores123',
    displayName: 'Ronald',
    customMessage: '«Ronald, las flores amarillas son símbolo de lealtad, éxito y energía positiva. Gracias por tu amistad firme y tu apoyo constante. Que la prosperidad y grandes victorias acompañen cada paso que des.»',
    animationType: 'spiral_vortex',
    roleDescription: 'Animación: Vórtice Galáctico de Flores Cósmicas',
    avatarSeed: '🌟'
  }
];

export const ANIMATION_DETAILS: Record<string, { title: string; subtitle: string; icon: string }> = {
  golden_bouquet: {
    title: 'Ramo Dorado & Luciérnagas',
    subtitle: 'Ramo radiante de flores amarillas con halo de luz y luciérnagas mágicas',
    icon: '💐'
  },
  sunflower_bloom: {
    title: 'Girasol en Floración',
    subtitle: 'Apertura orgánica central con espiral áurea de Fibonacci en SVG',
    icon: '🌻'
  },
  petals_rain: {
    title: 'Lluvia de Pétalos',
    subtitle: 'Caída fluida de pétalos amarillos a 60 FPS con ráfagas al tacto',
    icon: '🌸'
  },
  spiral_vortex: {
    title: 'Vórtice Galáctico',
    subtitle: 'Espiral hipnótica de pétalos cósmicos dorados con estelas de luz',
    icon: '🌟'
  },
  floating_sparkles: {
    title: 'Flores & Destellos',
    subtitle: 'Flores flotantes luminosas con efecto bokeh y partículas mágicas',
    icon: '✨'
  }
};
