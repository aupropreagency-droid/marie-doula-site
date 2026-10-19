// Générateur du site statique de Marie Graugnard, doula.
// Usage : node build.mjs  →  écrit le site dans ./public
import { mkdirSync, writeFileSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const SORTIE = 'public';
const TEL = '33652105482';
const FICHE_GOOGLE = 'https://share.google/hiO8zxGKeLJWMfdDU';
const PREVISU = true; // true = site en prévisualisation : non indexé par Google

const wa = (msg) => `https://wa.me/${TEL}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONE_WA = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/></svg>';
const coche = (couleur) => `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

const WA_GENERAL = wa('Bonjour Marie, j’ai une question : ');
const WA_DECOUVERTE = wa('Bonjour Marie, j’aimerais réserver l’échange téléphonique gratuit pour parler d’un accompagnement.');
const WA_SOLO = wa('Bonjour Marie, je vis ma maternité en solo et j’aimerais en parler avec vous.');

const IMG = {
  logo: '/images/logo.png',
  fauteuil: '/images/marie-fauteuil.jpg',
  portrait: '/images/marie-portrait.jpg',
  cuisine: '/images/marie-cuisine-portage.jpg',
  rebozo: '/images/soin-rebozo.jpg',
  rituel: '/images/rituel-mains.jpg',
  blessing: '/images/mama-blessing.jpg'
};

const CESU = 'J’exerce dans le cadre du service à la personne (CESU+) : crédit d’impôt sur le montant total, quels que soient vos revenus, avec l’avance immédiate au moment du paiement. Je vous guide dans les formalités.';

// ------------------------------------------------------------------
// Les services : une seule source pour les cartes de l’accueil et les pages
// ------------------------------------------------------------------
const services = [
  {
    groupe: 'accompagnements', slug: 'accompagnement-prenatal',
    etape: 'Désir d’enfant & grossesse', nom: 'Accompagnement prénatal',
    titreSeo: 'Accompagnement prénatal à Paris',
    description: 'Accompagnement prénatal par une doula à Paris : projet de naissance, préparation du jour J et du post-partum. 60 €/h, 30 €/h après crédit d’impôt.',
    image: IMG.logo, imageEstLogo: true, alt: '',
    carteTexte: 'Un espace d’écoute bienveillant, dès la pré-conception ou à tout moment de votre grossesse.',
    cartePoints: ['Votre projet de naissance', 'La préparation du jour J', 'Anticiper le post-partum'],
    prix: '60 €/h', prixDetail: '30 €/h après crédit d’impôt', avecCredit: true,
    carteAvis: { texte: 'Marie m’a beaucoup soutenue et encouragée pour mener à bien mon projet de naissance. Avec elle, tout a été plus facile et plus doux.', auteur: 'Agathe L.' },
    bouton: 'Écrire à Marie',
    wa: wa('Bonjour Marie, je suis enceinte de … mois et j’aimerais être accompagnée pendant ma grossesse.'),
    accroche: 'Dès la pré-conception ou à tout moment de votre grossesse, je suis là pour vous accompagner et vous soutenir. Mon accompagnement est avant tout émotionnel : un espace d’écoute bienveillant, un moment qui vous appartient, où tous les sujets peuvent être abordés librement.',
    inclusTitre: 'Lors de nos séances',
    inclus: [
      ['Votre projet de naissance', 'Je vous accompagne sur votre projet de naissance.'],
      ['La préparation du jour J', 'Je vous aide à préparer le jour J.'],
      ['Votre post-partum', 'Je vous donne des pistes pour l’anticiper.'],
      ['Le tissu rebozo', 'Le découvrir ou le redécouvrir, pour prendre soin de vous, physiquement et émotionnellement.'],
      ['Des informations utiles', 'Je partage les informations qui pourraient vous manquer pour vivre cette expérience en toute sérénité.']
    ],
    deroule: [
      ['Un premier échange gratuit', 'Une vingtaine de minutes au téléphone pour discuter de vos besoins, répondre à vos questions et voir si nous sommes en phase.'],
      ['Des séances sur mesure', 'Chaque rendez-vous est conçu pour répondre à vos besoins, dans un cadre sécurisant et chaleureux.']
    ],
    tarifs: [['Rendez-vous prénatal', 'À l’heure', '60 €/h', '30 €/h après crédit d’impôt']],
    tarifNote: CESU,
    avis: [
      ['Marie m’a beaucoup soutenue et encouragée pour mener à bien mon projet de naissance. Avec elle à mes côtés, tout a été plus facile et plus doux.', 'Agathe L.'],
      ['J’ai choisi Marie pour m’accompagner dans le chemin de la maternité quelques mois avant mon accouchement. Sa présence et son soutien ont été précieux.', 'Anne-Sophie D.'],
      ['Accompagnée à partir du dernier trimestre : extrêmement bienveillante et non jugeante, très à l’écoute, drôle, avec un grand sens pratique.', 'Sophie S.']
    ],
    infos: [
      ['Est-ce un accompagnement médical ?', 'Non. Mon accompagnement est avant tout émotionnel et se fait en complément du suivi avec votre sage-femme ou votre gynécologue.'],
      ['Quand commencer ?', 'Dès la pré-conception ou à tout moment de votre grossesse : le meilleur moment est celui où vous ressentez l’envie ou le besoin d’être accompagnée.'],
      ['Comment fonctionne le crédit d’impôt ?', 'J’exerce dans le cadre du service à la personne, avec le dispositif CESU+ : vous bénéficiez d’un crédit d’impôt sur le montant total de la prestation, quels que soient vos revenus, avec l’avance immédiate au moment du paiement. Je vous guide dans les formalités.']
    ]
  },
  {
    groupe: 'accompagnements', slug: 'presence-naissance',
    etape: 'Le jour J', nom: 'Présence à la naissance',
    titreSeo: 'Doula présente à la naissance à Paris',
    description: 'Une doula à vos côtés pour la naissance de votre bébé à Paris : astreinte de 3 semaines et présence le jour J, 800 €.',
    image: IMG.logo, imageEstLogo: true, alt: '',
    carteTexte: 'D’astreinte dès deux semaines avant votre terme et jusqu’à une semaine après, puis à vos côtés le jour de l’accouchement.',
    cartePoints: ['J’adapte mon planning pour être disponible', 'Une présence discrète mais précieuse', 'Un soutien émotionnel et rassurant'],
    prix: '800 €', prixDetail: '3 semaines d’astreinte + le jour J', avecCredit: false,
    carteAvis: { texte: 'Elle m’a accompagnée pendant ma grossesse et mon accouchement. Pleine de tendresse, toujours à l’écoute et jamais dans le jugement.', auteur: 'Anne-Sophie D.' },
    bouton: 'Écrire à Marie',
    wa: wa('Bonjour Marie, j’aimerais que vous soyez présente à mon accouchement. Mon terme est prévu le : '),
    accroche: 'Chères mamans, chères mamans solos, je peux être à vos côtés pour la naissance de votre bébé : une présence discrète mais précieuse, à l’écoute de vos besoins et de vos choix, pour que vous ne soyez pas seule à vivre ce moment unique.',
    inclusTitre: 'Ce que comprend cet accompagnement',
    inclus: [
      ['Une période d’astreinte', 'Dès deux semaines avant votre terme et jusqu’à une semaine après, j’adapte mon planning pour être pleinement disponible.'],
      ['Ma présence le jour J', 'Un soutien émotionnel, une écoute bienveillante et une présence rassurante tout au long de l’accouchement.'],
      ['Le respect de vos choix', 'Une présence discrète, à l’écoute de vos besoins et de vos choix.'],
      ['Pour toutes les mamans', 'Chères mamans, chères mamans solos : vous ne serez pas seule à vivre ce moment unique.']
    ],
    deroule: [
      ['Un premier échange gratuit', 'Une vingtaine de minutes au téléphone pour discuter de vos besoins, répondre à vos questions et voir si nous sommes en phase.'],
      ['L’astreinte', 'Dès deux semaines avant votre terme et jusqu’à une semaine après, j’adapte mon planning pour être pleinement disponible.'],
      ['Le jour de la naissance', 'Je suis à vos côtés : un soutien émotionnel, une écoute bienveillante et une présence rassurante.']
    ],
    tarifs: [
      ['Astreinte', 'De 2 semaines avant le terme à 1 semaine après', '100 €/sem.', 'soit 300 € pour 3 semaines'],
      ['Présence le jour J', 'Le jour de l’accouchement', '500 €', ''],
      ['Total', 'Astreinte + jour J', '800 €', '']
    ],
    tarifNote: 'Mon accompagnement n’est pas médical, il se fait en complément du suivi avec votre sage-femme ou votre gynécologue.',
    avis: [
      ['Je recommande vivement Marie, qui m’a accompagnée pendant ma grossesse, mon accouchement et encore aujourd’hui. Pleine de tendresse et de bienveillance, toujours à l’écoute et jamais dans le jugement.', 'Anne-Sophie D.'],
      ['Très réactive, à l’écoute, elle a ce talent de tout anticiper simplement. Un grand soutien au quotidien, et même une astreinte pour réussir notre rencontre, maman et bébé.', 'Elsa A.'],
      ['Son écoute attentive, sa bienveillance et ses connaissances de la périnatalité nous ont permis d’être sereines pour le grand saut dans la parentalité.', 'Fanny & Solène']
    ],
    infos: [
      ['Est-ce un accompagnement médical ?', 'Non. Mon rôle est de vous apporter un soutien émotionnel, une écoute bienveillante et une présence rassurante. Il se fait en complément du suivi avec votre sage-femme ou votre gynécologue.'],
      ['Peut-on préparer la naissance ensemble avant ?', 'Oui : l’accompagnement prénatal permet de travailler votre projet de naissance et de préparer le jour J.'],
      ['Je vis ma maternité solo, est-ce pour moi ?', 'Oui. La vie met sur ma route des mamans solos, encore et encore. Vous ne serez jamais seule dans cette aventure.']
    ]
  },
  {
    groupe: 'accompagnements', slug: 'rendez-vous-postnatal',
    etape: 'Après la naissance', nom: 'Rendez-vous postnatal',
    titreSeo: 'Rendez-vous postnatal avec une doula à Paris',
    description: 'Rendez-vous postnatal avec une doula à Paris : récit de naissance, portage, premiers pas de jeune maman. 60 €/h, 30 €/h après crédit d’impôt.',
    image: IMG.logo, imageEstLogo: true, alt: '',
    carteTexte: 'Un espace d’écoute, un moment à vous, pour exprimer vos émotions et vos interrogations en toute liberté.',
    cartePoints: ['Votre récit de naissance', 'Portage et langue des signes pour bébé', 'Motricité libre, diversification…'],
    prix: '60 €/h', prixDetail: '30 €/h après crédit d’impôt', avecCredit: true,
    carteAvis: { texte: 'Nos rendez-vous hebdomadaires étaient une bouffée d’air frais. Elle m’a tant appris sur mon bébé, sur mon corps, sur l’allaitement.', auteur: 'Charlotte A.' },
    bouton: 'Écrire à Marie',
    wa: wa('Bonjour Marie, j’ai accouché il y a … et j’aimerais un rendez-vous postnatal.'),
    accroche: 'Après la naissance de votre bébé, je suis là pour vous accompagner à chaque étape. Toujours centrée sur le soutien émotionnel, je vous propose un espace d’écoute bienveillant, un moment à vous, où exprimer toutes vos émotions et interrogations en toute liberté.',
    inclusTitre: 'Ce que nous pourrons partager',
    inclus: [
      ['Votre récit de naissance', 'Et les émotions qui y sont liées.'],
      ['Vos premiers pas de jeune maman', 'Vos questionnements, à votre rythme.'],
      ['Le tissu rebozo', 'Un outil pour favoriser votre bien-être physique et émotionnel.'],
      ['Le portage', 'Des conseils adaptés à vos besoins et à ceux de votre bébé.'],
      ['La langue des signes pour bébé', 'Poser les bases d’une communication simple et naturelle dès les premiers mois.'],
      ['Et bien d’autres sujets', 'Motricité libre, diversification alimentaire…']
    ],
    deroule: [
      ['Un premier échange gratuit', 'Une vingtaine de minutes au téléphone pour discuter de vos besoins, répondre à vos questions et voir si nous sommes en phase.'],
      ['Des rencontres sur mesure', 'Chaque rencontre s’adapte à vos besoins, dans un environnement rassurant et bienveillant.']
    ],
    tarifs: [['Rendez-vous postnatal', 'À l’heure', '60 €/h', '30 €/h après crédit d’impôt']],
    tarifNote: CESU,
    avis: [
      ['Nos rendez-vous hebdomadaires étaient une bouffée d’air frais, de joie et de détente. Elle m’a tant appris sur mon bébé, sur mon corps, sur l’allaitement.', 'Charlotte A.'],
      ['On devrait toutes avoir une Marie dans notre vie quand on devient parent. Marie écoute, conseille quand on la sollicite, on chemine ensemble.', 'Clémence B.'],
      ['Elle nous a aidés avec d’innombrables conseils pratiques et techniques, toujours avec douceur, soutien et affection.', 'Lucía C.']
    ],
    infos: [
      ['Est-ce un accompagnement médical ?', 'Non. Il vient en complément du suivi par votre sage-femme, votre gynécologue ou votre pédiatre.'],
      ['Quelle différence avec le soutien post-partum à domicile ?', 'Le rendez-vous postnatal est un temps d’écoute et d’échange. Le soutien post-partum est une présence à domicile deux ou trois fois par semaine, avec une aide dans les tâches du quotidien.'],
      ['Comment fonctionne le crédit d’impôt ?', 'J’exerce dans le cadre du service à la personne, avec le dispositif CESU+ : vous bénéficiez d’un crédit d’impôt sur le montant total de la prestation, quels que soient vos revenus, avec l’avance immédiate au moment du paiement.']
    ]
  },
  {
    groupe: 'accompagnements', slug: 'soutien-post-partum',
    etape: 'Post-partum au quotidien', nom: 'Soutien post-partum à domicile',
    titreSeo: 'Soutien post-partum à domicile à Paris',
    description: 'Une doula chez vous 2 à 3 fois par semaine après la naissance : repas maison, relais avec bébé, écoute. 25 €/h, 12,50 €/h après crédit d’impôt.',
    image: IMG.logo, imageEstLogo: true, alt: '',
    imagePage: IMG.cuisine, altPage: 'Marie dans une cuisine, un bébé contre elle dans une écharpe de portage',
    carteTexte: 'Un soutien quasi quotidien chez vous : aide dans les tâches du quotidien et écoute bienveillante.',
    cartePoints: ['Préparation des repas', 'Je veille sur bébé le temps d’une douche ou d’une sieste', '2 × 3 h ou 3 × 3 h par semaine'],
    prix: '25 €/h', prixDetail: '12,50 €/h après crédit d’impôt', avecCredit: true,
    carteAvis: { texte: 'Notre bulle d’oxygène : dormir quelques heures et retrouver un bébé apaisé et des plats maison réconfortants.', auteur: 'Claire T.' },
    bouton: 'Écrire à Marie',
    wa: wa('Bonjour Marie, je suis intéressée par le soutien post-partum à domicile. Mon bébé est né / doit naître le : '),
    accroche: 'Les premières semaines, les premiers mois après la naissance de votre bébé peuvent être intenses. Je propose une offre unique à Paris, conçue pour soulager l’intensité de votre post-partum avec un soutien quasi quotidien, adapté à vos besoins.',
    inclusTitre: 'Mon accompagnement inclut',
    inclus: [
      ['Des repas nourrissants', 'Je vous cuisine des repas nourrissants.'],
      ['Le relais avec bébé', 'Je veille sur votre bébé le temps d’une douche ou d’une sieste.'],
      ['Une aide logistique', 'Gestion des tâches quotidiennes, soutien à la maison.'],
      ['Une écoute bienveillante', 'Un espace pour vous exprimer librement.'],
      ['Des conseils pratiques', 'Des astuces pour faciliter votre quotidien.'],
      ['Un soutien à la parentalité', 'Un accompagnement dans vos nouvelles responsabilités.']
    ],
    deroule: [
      ['Un premier échange gratuit', 'Une vingtaine de minutes au téléphone pour discuter de vos besoins, répondre à vos questions et voir si nous sommes en phase.'],
      ['On choisit votre formule', 'Offre mini : 2 fois 3 h par semaine. Offre maxi : 3 fois 3 h par semaine.'],
      ['Un soutien à votre rythme', 'Un accompagnement quasi quotidien, adapté à votre rythme et à vos besoins, dans le respect de votre espace et de votre parentalité.']
    ],
    tarifs: [
      ['Offre mini', '2 × 3 h par semaine', '150 €/sem.', '75 € après crédit d’impôt'],
      ['Offre maxi', '3 × 3 h par semaine', '225 €/sem.', '112,50 € après crédit d’impôt']
    ],
    tarifNote: 'Tarif horaire de 25 €. ' + CESU,
    avis: [
      ['Notre bulle d’oxygène dans les premières semaines : dormir quelques heures et retrouver à notre réveil un bébé bien au chaud et apaisé, et des plats maison réconfortants.', 'Claire T.'],
      ['Des bons petits plats pour la semaine, du relais pour s’occuper de bébé, un tas de linge plié… Tout le monde devrait avoir Marie dans sa vie de post-partum.', 'Andrea A.'],
      ['Son écoute, ses bras, ses conseils, ses petites thermos de thé… et surtout sa cuisine : la charge mentale s’envolait pour la semaine. Team légumes grillés !', 'Ida P.']
    ],
    infos: [
      ['Est-ce un accompagnement médical ?', 'Non. Il vient en complément du suivi par votre sage-femme, votre gynécologue ou votre pédiatre.'],
      ['Quand faire appel à moi ?', 'Le meilleur moment est celui où vous ressentez l’envie ou le besoin d’être accompagnée. Durant les premiers mois, je vous accompagne face à la fatigue, aux doutes et aux besoins du quotidien.'],
      ['Comment fonctionne le crédit d’impôt ?', 'J’exerce dans le cadre du service à la personne, avec le dispositif CESU+ : vous bénéficiez d’un crédit d’impôt sur le montant total de la prestation, quels que soient vos revenus, avec l’avance immédiate au moment du paiement.']
    ]
  },
  {
    groupe: 'soins', slug: 'instant-rebozo',
    etape: 'Soin', etapePage: 'Soin · massage aux tissus', nom: 'L’instant rebozo',
    titreSeo: 'Soin rebozo à Paris 13e',
    description: 'L’instant rebozo : 1 h 30 de bercements et de serrages avec les tissus rebozo, chez vous ou à Paris 13e. 120 €. Bébé bienvenu.',
    image: IMG.rebozo, alt: 'Une femme allongée, enveloppée dans des tissus rebozo',
    carteTexte: 'Bercements et serrages avec les tissus rebozo : détente, relâchement du corps, libération des émotions.',
    cartePoints: ['Chez vous ou chez moi (Paris 13e)', 'Votre bébé peut rester avec vous', 'Temps d’échange avant et après'],
    prix: '120 €', prixDetail: '1 h 30', prixDetailPage: '1 h 30 · chez vous ou chez moi (Paris 13e)', avecCredit: false,
    carteAvis: { texte: 'Le soin de Marie m’a fait un bien fou. Elle s’adapte à la présence du bébé pour que vous en profitiez pleinement.', auteur: 'Joséphine B.' },
    bouton: 'Réserver', boutonPage: 'Réserver un instant rebozo',
    wa: wa('Bonjour Marie, j’aimerais réserver un instant rebozo.'),
    accroche: 'Le rebozo est un châle traditionnel mexicain, utilisé pour le soutien physique et émotionnel des femmes à travers des bercements et des serrages. Particulièrement apprécié pendant ou après une grossesse, l’instant rebozo est aussi un soin que l’on peut s’offrir à tout moment de sa vie de femme.',
    inclusTitre: 'Pendant cette heure et demie',
    inclus: [
      ['L’installation de l’espace', 'Chez vous, ou chez moi dans le 13e arrondissement.'],
      ['Un temps d’échange', 'Avant et après le soin.'],
      ['Des bercements', 'Avec mes rebozos, sur différents points du corps.'],
      ['Un serrage de bassin', 'Sauf pendant la grossesse.'],
      ['Votre bébé est le bienvenu', 'Pour les mères, votre bébé peut vous accompagner pendant le soin.'],
      ['Pour toutes les femmes', 'Pendant ou après une grossesse, ou à tout moment de votre vie de femme.']
    ],
    deroule: [
      ['Vous m’écrivez', 'On choisit ensemble une date et le lieu : chez vous ou chez moi, dans le 13e.'],
      ['L’installation', 'J’installe l’espace et nous prenons un temps d’échange.'],
      ['Le soin', 'Bercements, serrage de bassin, puis un dernier temps d’échange.']
    ],
    tarifs: [['L’instant rebozo', '1 h 30 · chez vous ou chez moi', '120 €', '']],
    tarifNote: 'Je me déplace à votre domicile ou vous reçois chez moi, dans le 13e arrondissement.',
    avis: [
      ['Le soin de Marie m’a fait un bien fou. Elle s’adapte à la présence du bébé et vous met dans les meilleures conditions pour en profiter pleinement.', 'Joséphine B.'],
      ['Meilleur cadeau de naissance ! Marie a su s’adapter à la présence de mon bébé, qui a voulu profiter du soin elle aussi. Un vrai moment pour soi.', 'Imen E.'],
      ['Quand Marie arrive, on a l’impression de recevoir une amie à qui on peut tout dire. Un moment hors du temps.', 'Clara D.']
    ],
    infos: [
      ['Puis-je le recevoir pendant ma grossesse ?', 'Oui. Le soin s’adapte : il n’y a simplement pas de serrage de bassin pendant la grossesse.'],
      ['Mon bébé peut-il être là ?', 'Oui, pour les mères, votre bébé peut vous accompagner durant ce soin.'],
      ['Est-ce réservé aux jeunes mamans ?', 'Non. C’est un soin que l’on peut s’offrir à tout moment de sa vie de femme.']
    ]
  },
  {
    groupe: 'soins', slug: 'rituel-rebozo',
    etape: 'Soin à deux doulas', nom: 'Le rituel rebozo à 4 mains',
    titreSeo: 'Rituel rebozo à 4 mains à Paris 13e',
    description: 'Le rituel rebozo à 4 mains : 3 heures avec deux doulas, massage à l’huile, bain aux plantes et serrage en 7 points, à Paris 13e. 380 €.',
    image: IMG.rituel, alt: 'Mains nouant un tissu rebozo pendant un serrage',
    carteTexte: 'Un soin à 4 mains, avec deux doulas : un moment de partage et de sororité.',
    cartePoints: ['Massage à l’huile à 4 mains', 'Bain chaud aux plantes', 'Serrage en 7 points'],
    prix: '380 €', prixDetail: '3 h · chez moi (Paris 13e)', avecCredit: false,
    carteAvis: { texte: 'J’avais besoin de me retrouver, de tourner la page, et c’est chose faite. Je le recommande à toutes les femmes, pas uniquement aux mères.', auteur: 'Cindy D.' },
    bouton: 'Réserver', boutonPage: 'Réserver le rituel',
    wa: wa('Bonjour Marie, j’aimerais réserver un rituel rebozo à 4 mains.'),
    accroche: 'Le rituel rebozo est un cadeau que l’on se fait, une parenthèse d’amour pour soi. Nous sommes deux doulas à prendre soin de vous : un moment de partage et de sororité, qui peut accompagner un passage important de votre vie.',
    inclusTitre: 'Ce que comprend le rituel',
    inclus: [
      ['Un temps d’échange', 'Avant et après le soin, autour d’une boisson chaude.'],
      ['Un massage à 4 mains', 'Un massage de tout le corps, à l’huile.'],
      ['Un bain chaud aux plantes', 'Pour relâcher le corps et prolonger la détente.'],
      ['Un serrage en 7 points', 'En 7 points du corps, avec les rebozos.'],
      ['Deux doulas pour vous', 'Nous avons à cœur d’honorer le corps féminin, de le choyer, et à travers lui votre cœur et votre esprit.'],
      ['Un espace doux', 'Chez moi, dans le 13e arrondissement, dans un cadre bienveillant.']
    ],
    deroule: [
      ['Vous m’écrivez', 'On choisit ensemble une date pour ces trois heures rien qu’à vous.'],
      ['L’accueil', 'Nous vous recevons chez moi et prenons le temps d’échanger autour d’une boisson chaude.'],
      ['Le rituel', 'Massage à 4 mains, bain aux plantes, serrage en 7 points, puis un dernier temps de partage.']
    ],
    tarifs: [['Le rituel rebozo à 4 mains', '3 h · avec deux doulas', '380 €', '']],
    tarifNote: 'Pour les mères, ce soin est réalisé sans bébé, afin de garantir ce moment de relaxation et de connexion au corps.',
    avis: [
      ['Je ne trouve pas les mots pour remercier Marie et Jeanne. J’avais besoin de me retrouver, de tourner la page, et c’est chose faite. Je recommande à toutes les femmes, et pas uniquement aux mères.', 'Cindy D.', 'Avis Google'],
      ['Un grand merci à vous deux pour ce magnifique soin tout en bienveillance, douceur et puissance. C’était magique !', 'Hélène', 'Témoignage']
    ],
    infos: [
      ['Mon bébé peut-il venir ?', 'Pour garantir ce moment de relaxation et de connexion au corps, ce soin est réalisé sans bébé à vos côtés.'],
      ['À qui s’adresse le rituel ?', 'À toutes les femmes, de tout âge. Il est particulièrement apprécié des nouvelles mères.'],
      ['Où a-t-il lieu ?', 'Chez moi, dans le 13e arrondissement de Paris, dans un espace doux et bienveillant.']
    ]
  },
  {
    groupe: 'soins', slug: 'mama-blessing',
    etape: 'Cérémonie', nom: 'Le Mama Blessing',
    titreSeo: 'Mama Blessing à Paris',
    description: 'Le Mama Blessing : une cérémonie de 3 heures pour célébrer la future maman, entourée des femmes qui comptent pour elle. 340 €.',
    image: IMG.blessing, alt: 'Table de Mama Blessing décorée de fleurs séchées et de bougies',
    carteTexte: 'Une cérémonie pour célébrer la future maman, entourée des femmes qui comptent pour elle.',
    cartePoints: ['Une parenthèse sacrée', 'Avec votre « village »', 'Avant la naissance'],
    prix: '340 €', prixDetail: '3 h', avecCredit: false,
    carteAvis: { texte: 'Marie a su être à l’écoute pour organiser un événement à mon image. Toutes étaient ravies de ce moment !', auteur: 'Mélanie D.' },
    bouton: 'Organiser', boutonPage: 'Organiser un Mama Blessing',
    wa: wa('Bonjour Marie, j’aimerais organiser un Mama Blessing pour : '),
    accroche: 'Une cérémonie unique et précieuse, dédiée à célébrer la future mère, à l’honorer et à l’accompagner avec amour jusqu’à la naissance de son bébé, entourée des femmes qui comptent pour elle.',
    inclusTitre: 'Ce que je vous propose',
    inclus: [
      ['Une cérémonie pour vous', 'Dédiée à célébrer la future mère, à l’honorer et à l’accompagner avec amour jusqu’à la naissance de son bébé.'],
      ['Votre « village » réuni', 'Les femmes qui comptent pour vous, autour de vous.'],
      ['Une bulle de soutien', 'Pendant quelques heures, elles prennent soin de vous avec amour, bienveillance et douceur.'],
      ['Une parenthèse sacrée', 'Un moment où vous êtes célébrée pour la femme et la mère que vous êtes.'],
      ['Je facilite ce moment', 'C’est avec joie et gratitude que je facilite ce moment intime.']
    ],
    deroule: [
      ['Vous m’écrivez', 'Nous parlons de vos envies et des femmes que vous souhaitez réunir.'],
      ['Le jour de la cérémonie', 'Pendant trois heures, je facilite ce moment intime, entourée des femmes qui comptent pour vous.']
    ],
    tarifs: [['Mama Blessing', '3 h · cérémonie facilitée par Marie', '340 €', '']],
    tarifNote: '',
    avis: [
      ['Mille mercis à Marie pour l’organisation de ma cérémonie autour de ma grossesse. Elle a su être à l’écoute pour organiser un évènement à mon image. Un contact très agréable, doux, facile, joyeux, pour mettre tout le monde à l’aise. Toutes étaient ravies de ce moment !', 'Mélanie D.']
    ],
    infos: [
      ['Quand l’organiser ?', 'Pendant la grossesse, pour vous accompagner avec amour jusqu’à la naissance de votre bébé.'],
      ['Qui inviter ?', 'Les femmes qui comptent pour vous, celles qui forment votre « village ».']
    ]
  }
];

// ------------------------------------------------------------------
// Gabarits communs
// ------------------------------------------------------------------
function tete({ titre, description, chemin }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
${PREVISU ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:image" content="/images/marie-fauteuil.jpg">
<meta name="theme-color" content="#FBF6F0">
<link rel="icon" type="image/png" href="/images/logo.png">
<link rel="canonical" href="${chemin}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&amp;family=DM+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
`;
}

function entete() {
  return `<header class="entete">
<div class="conteneur entete-int">
<a class="marque" href="/">
<img src="${IMG.logo}" alt="" width="58" height="93">
<span class="marque-texte"><span class="marque-nom">Marie Graugnard</span><span class="marque-sous">Doula · Paris &amp; proche banlieue sud</span></span>
</a>
<nav class="nav" aria-label="Navigation principale">
<a class="nav-offre" href="/#accompagnements">Accompagnements</a>
<a class="nav-offre" href="/#soins">Soins &amp; cérémonies</a>
<a href="/#avis">Avis</a>
<a href="/#apropos">À propos</a>
<a href="/#faq">Questions</a>
</nav>
<a class="btn btn-entete" href="${WA_GENERAL}" aria-label="Écrire à Marie sur WhatsApp">${ICONE_WA}<span>Écrire à Marie</span></a>
</div>
</header>
`;
}

function pied(lienWa = WA_DECOUVERTE, boutonFlottant = 'Écrire à Marie') {
  return `<footer class="pied">
<div class="conteneur pied-int">
<div class="pied-appel">
<div class="pied-appel-texte">
<h2>Envie d’en parler ?</h2>
<ol class="mini-etapes">
<li><b>1</b>Vous m’écrivez sur WhatsApp</li>
<li><b>2</b>On échange 20 min, gratuitement</li>
<li><b>3</b>On construit votre accompagnement</li>
</ol>
</div>
<a class="btn btn-grand" href="${lienWa}">${ICONE_WA}Écrire à Marie sur WhatsApp</a>
</div>
<div class="pied-infos">
<div class="col">
<img src="${IMG.logo}" alt="" width="40" height="64">
<strong>Marie Graugnard · Doula</strong>
<a href="mailto:mariedoula75@gmail.com">mariedoula75@gmail.com</a>
<a href="https://www.instagram.com/marie_doula_paris/">Instagram @marie_doula_paris</a>
</div>
<div class="col" style="max-width:460px">
<span>Accompagnement non médical, en complément du suivi par votre sage-femme, votre gynécologue ou votre pédiatre.</span>
<span>Services à la personne · [N° de déclaration SAP]</span>
</div>
<div class="col">
<a href="/mentions-legales">Mentions légales</a>
<a href="/mentions-legales#confidentialite">Confidentialité</a>
</div>
</div>
</div>
</footer>
<a class="flottant" href="${lienWa}" aria-label="${esc(boutonFlottant)} sur WhatsApp">${ICONE_WA}<span class="sr">${esc(boutonFlottant)}</span></a>
`;
}

const fin = (avecScript) => `${avecScript ? '<script src="/carrousel.js" defer></script>\n' : ''}<script src="/bulle.js" defer></script>\n</body>
</html>
`;

// ------------------------------------------------------------------
// Accueil
// ------------------------------------------------------------------
function carte(s) {
  const sauge = s.groupe === 'soins';
  const classeImg = 'carte-img' + (s.imageEstLogo ? ' logo' : '') + (sauge ? ' sauge' : '');
  return `<article class="carte" id="${s.slug}">
<img class="${classeImg}" src="${s.image}" alt="${esc(s.alt)}" loading="lazy">
<div class="carte-corps">
<span class="carte-etape${sauge ? ' sauge' : ''}">${esc(s.etape)}</span>
<h3><a href="/${s.slug}" style="color:inherit;text-decoration:none">${esc(s.nom)}</a></h3>
<p class="carte-texte">${esc(s.carteTexte)}</p>
<ul class="coches">
${s.cartePoints.map((p) => `<li>${coche('#6B8266')}<span>${esc(p)}</span></li>`).join('\n')}
</ul>
<a class="lien-fleche" href="/${s.slug}">En savoir plus →</a>
<figure class="avis-mini">
<blockquote>« ${esc(s.carteAvis.texte)} »</blockquote>
<figcaption><span><span class="etoiles" aria-label="5 étoiles sur 5">★★★★★</span> ${esc(s.carteAvis.auteur)} · Avis Google</span><a href="${FICHE_GOOGLE}">Voir plus d’avis →</a></figcaption>
</figure>
<div class="carte-pied">
<div class="prix"><strong>${esc(s.prix)}</strong><span${s.avecCredit ? '' : ' class="neutre"'}>${esc(s.prixDetail)}</span></div>
<a class="btn btn-petit" href="${s.wa}">${ICONE_WA}${esc(s.bouton)}</a>
</div>
</div>
</article>`;
}

function points(id, n) {
  return `<div class="points-carrousel" id="${id}" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i${i === 0 ? ' class="actif"' : ''}></i>`).join('')}<span>1 / ${n}</span></div>`;
}

function accueil() {
  const acc = services.filter((s) => s.groupe === 'accompagnements');
  const soins = services.filter((s) => s.groupe === 'soins');
  return tete({
    titre: 'Marie Graugnard · Doula à Paris & proche banlieue sud',
    description: 'Doula à Paris et proche banlieue sud : accompagnement de la grossesse aux premiers mois, présence à la naissance, soutien post-partum à domicile, soins rebozo. 5,0 ★ sur 28 avis.',
    chemin: '/'
  }) + entete() + `<main>
<section class="conteneur heros" id="accueil">
<div class="heros-texte">
<p class="surtitre">Doula à Paris &amp; proche banlieue sud</p>
<h1 class="h1">Accompagner les femmes, <em>à chaque étape.</em></h1>
<p class="chapo">Vous êtes enceinte, vous venez d’accueillir votre bébé ou vous commencez à imaginer votre parcours vers la parentalité ? Vous ressentez le besoin d’être écoutée, soutenue, accompagnée : vous êtes au bon endroit.</p>
<div class="groupe-btn">
<a class="btn btn-grand" href="#accompagnements">Voir les accompagnements <span aria-hidden="true">↓</span></a>
<a class="btn btn-grand btn-sauge" href="#soins">Voir les soins <span aria-hidden="true">↓</span></a>
</div>
<p class="texte" style="font-size:15px;color:var(--texte-3)">Pas sûre de ce qu’il vous faut ? <a href="${WA_DECOUVERTE}" style="font-weight:600">Réservez l’échange gratuit de 20 minutes</a> sur WhatsApp.</p>
</div>
<div class="heros-visuel">
<img class="arche" src="${IMG.fauteuil}" alt="Marie tenant un nouveau-né dans ses bras, assise près d’une fenêtre" width="420" height="540" fetchpriority="high">
<div class="badge-avis"><strong>5,0 <span class="etoiles">★★★★★</span></strong><span class="discret">28 avis Google</span></div>
</div>
</section>

<section class="bandeau" aria-label="En bref">
<div class="conteneur bandeau-int">
<div class="bandeau-item"><strong>5,0 ★ · 28 avis</strong><span>sur Google</span></div>
<div class="bandeau-item"><strong>−50 % avec le CESU+</strong><span>Crédit d’impôt sur les accompagnements</span></div>
<div class="bandeau-item"><strong>4 ans de doula</strong><span>après 13 ans d’assistante maternelle</span></div>
<div class="bandeau-item"><strong>Chez vous</strong><span>Paris &amp; proche banlieue sud</span></div>
</div>
</section>

<section class="conteneur section pile pile-32" id="accompagnements" style="padding-bottom:48px">
<div class="intro">
<div class="intro-texte">
<span class="etiquette">Accompagnements</span>
<h2 class="h2">Votre accompagnement sur mesure, pour une maternité plus sereine</h2>
<p class="texte">Je vous offre une écoute attentive, une présence réconfortante, et un soutien respectueux de vos choix, de votre histoire et de votre rythme.</p>
<p class="texte">Mon accompagnement n’est pas médical : il vient en complément du suivi réalisé par votre sage-femme, votre gynécologue ou tout autre professionnel de santé.</p>
<p class="discret">Prix indiqués avant crédit d’impôt.</p>
</div>
<img class="intro-photo" src="${IMG.cuisine}" alt="Marie dans une cuisine, un bébé contre elle dans une écharpe de portage" loading="lazy">
</div>
<div class="grille grille-2 carrousel" data-carrousel="points-acc">
${acc.map(carte).join('\n')}
</div>
${points('points-acc', acc.length)}
<div class="solo">
<div class="solo-texte"><strong>Vous vivez la maternité solo ?</strong><span>La vie met sur ma route des mamans solos, encore et encore. Vous ne serez jamais seule dans cette aventure.</span></div>
<a class="btn btn-clair" href="${WA_SOLO}">Parlons-en</a>
</div>
</section>

<section class="conteneur section pile pile-32" id="soins" style="padding-top:48px">
<div class="intro-simple">
<span class="etiquette sauge">Soins &amp; cérémonies</span>
<h2 class="h2">Une parenthèse pour soi</h2>
<p class="texte">Le rebozo est un châle traditionnel mexicain, utilisé pour le soutien physique et émotionnel des femmes à travers des bercements et des serrages. Pendant ou après une grossesse, ou à tout moment de votre vie de femme.</p>
</div>
<div class="grille grille-3 carrousel" data-carrousel="points-soins">
${soins.map(carte).join('\n')}
</div>
${points('points-soins', soins.length)}
</section>

<section class="fond-rose" id="avis">
<div class="conteneur avis-entete" style="padding-top:56px;padding-bottom:56px">
<div class="pile" style="gap:8px">
<h2 class="h2-moyen">Elles en parlent</h2>
<p class="texte" style="font-size:18px"><strong style="color:var(--texte)">5,0 <span class="etoiles">★★★★★</span></strong> · 28 avis sur Google</p>
</div>
<div class="groupe-btn" style="gap:12px">
<a class="btn btn-contour btn-petit" href="${FICHE_GOOGLE}">Voir tous les avis</a>
<a class="btn btn-petit" href="${FICHE_GOOGLE}" style="background:transparent;color:var(--brun)">Laisser un avis</a>
</div>
</div>
</section>

<section class="conteneur section apropos" id="apropos">
<img class="apropos-photo" src="${IMG.portrait}" alt="Portrait de Marie, souriante, en extérieur" loading="lazy">
<div class="apropos-texte">
<span class="surtitre">Bienvenue dans mon cocon</span>
<h2 class="h2" style="font-size:40px;line-height:1.15">Je m’appelle Marie : femme, mère, compagne, amie, et doula.</h2>
<p class="texte" style="font-size:18px">Diplômée de la Petite Enfance, j’ai travaillé pendant 13 ans en tant qu’assistante maternelle, aux côtés de nombreuses familles. Je suis aussi maman de trois garçons. J’ai vécu trois post-partum, avec leurs doutes, leur solitude, et cette peur de demander de l’aide.</p>
<p class="citation">Aujourd’hui, je veux offrir aux mères ce que j’aurais aimé recevoir : un soutien bienveillant, une présence sans jugement, une aide concrète au quotidien.</p>
<p class="texte">Comme une sœur, une amie ou une mère, avec mon expertise à vos côtés.</p>
</div>
</section>

<section class="conteneur-etroit section pile pile-24" id="faq">
<h2 class="h2">Vos questions</h2>
<div class="faq">
<details><summary>Quand faire appel à moi ?</summary><p>Le meilleur moment est celui où vous ressentez l’envie ou le besoin d’être accompagnée : avant l’arrivée de bébé, pour la préparation émotionnelle et organisationnelle ; lors de la naissance, pour une présence calme et apaisante ; durant les premiers mois, face à la fatigue, aux doutes et aux besoins du quotidien.</p></details>
<details><summary>Est-ce un accompagnement médical ?</summary><p>Non. Mon accompagnement vient en complément du suivi réalisé par votre sage-femme, votre gynécologue ou tout autre professionnel de santé.</p></details>
<details><summary>Comment fonctionne le crédit d’impôt avec le CESU+ ?</summary><p>J’exerce mon activité dans le cadre du service à la personne. Vous bénéficiez d’un crédit d’impôt sur le montant total de ma prestation, quels que soient vos revenus, avec l’avance immédiate au moment du paiement (dans la limite de 6 000 € de crédit par an pour l’emploi à domicile). Les formalités sont très simplifiées, et je suis à vos côtés pour vous guider.</p></details>
<details><summary>Où intervenez-vous ?</summary><p>À votre domicile, à Paris et en proche banlieue sud [liste à confirmer]. Pour l’instant rebozo, je peux aussi vous recevoir chez moi, dans le 13e arrondissement.</p></details>
</div>
</section>
</main>
` + pied(WA_DECOUVERTE) + fin(true);
}

// ------------------------------------------------------------------
// Pages service
// ------------------------------------------------------------------
function pageService(s) {
  const sauge = s.groupe === 'soins';
  const groupeNom = sauge ? 'Soins & cérémonies' : 'Accompagnements';
  const groupeLien = sauge ? '/#soins' : '/#accompagnements';
  const voirAutres = sauge ? 'Les autres soins' : 'Les autres accompagnements';
  const image = s.imagePage || s.image;
  const alt = s.imagePage ? s.altPage : s.alt;
  const estLogo = !s.imagePage && s.imageEstLogo;
  const couleurCoche = sauge ? '#4F6449' : '#924A48';
  const autres = services.filter((x) => x.slug !== s.slug);
  const avisHtml = s.avis.map(([texte, auteur, source]) => `<figure class="avis-carte">
<span class="etoiles" aria-label="5 étoiles sur 5">★★★★★</span>
<blockquote>« ${esc(texte)} »</blockquote>
<figcaption><strong>${esc(auteur)}</strong> · ${esc(source || 'Avis Google')}</figcaption>
</figure>`).join('\n');

  return tete({ titre: `${s.titreSeo} · Marie Graugnard, doula`, description: s.description, chemin: '/' + s.slug }) + entete() + `<main>
<nav class="conteneur ariane" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">›</span><a href="${groupeLien}">${esc(groupeNom)}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(s.nom)}</span></nav>

<section class="conteneur heros heros-service">
<div class="heros-texte" style="gap:22px">
<span class="etiquette${sauge ? ' sauge' : ''}">${esc(s.etapePage || s.etape)}</span>
<h1 class="h1" style="font-size:56px">${esc(s.nom)}</h1>
<p class="chapo">${esc(s.accroche)}</p>
<div class="prix-heros"><strong>${esc(s.prix)}</strong><span${s.avecCredit ? '' : ' class="neutre"'}>${s.avecCredit ? 'soit ' : ''}${esc(s.prixDetailPage || s.prixDetail)}</span></div>
<div class="groupe-btn" style="gap:12px">
<a class="btn" href="${s.wa}">${ICONE_WA}${esc(s.boutonPage || s.bouton)}</a>
<a class="btn btn-contour" href="${groupeLien}">${esc(voirAutres)}</a>
</div>
</div>
<div class="heros-visuel">
<img class="arche${estLogo ? ' logo' : ''}${sauge ? ' sauge' : ''}" src="${image}" alt="${esc(alt)}" width="440" height="460" fetchpriority="high">
</div>
</section>

<section class="fond-blanc">
<div class="conteneur section pile pile-32">
<h2 class="h2" style="font-size:40px">${esc(s.inclusTitre)}</h2>
<ul class="inclus">
${s.inclus.map(([t, d]) => `<li>${coche(couleurCoche).replace('width="18" height="18"', 'width="22" height="22"')}<span><strong>${esc(t)}</strong><span>${esc(d)}</span></span></li>`).join('\n')}
</ul>
</div>
</section>

<section class="conteneur section deroule-bloc">
<div class="deroule">
<h2 class="h2" style="font-size:40px">Comment ça se passe</h2>
<ol>
${s.deroule.map(([t, d], i) => `<li><span class="num${sauge ? ' sauge' : ''}">${i + 1}</span><span><strong>${esc(t)}</strong><span class="d">${esc(d)}</span></span></li>`).join('\n')}
</ol>
</div>
<aside class="tarifs" aria-label="Tarifs">
<h2>${s.tarifs.length > 1 ? 'Tarifs' : 'Tarif'}</h2>
${s.tarifs.map(([label, sous, valeur, note]) => `<div class="tarif-ligne"><div class="g"><strong>${esc(label)}</strong><span>${esc(sous)}</span></div><div class="d"><strong>${esc(valeur)}</strong>${note ? `<span>${esc(note)}</span>` : ''}</div></div>`).join('\n')}
${s.tarifNote ? `<p class="discret">${esc(s.tarifNote)}</p>` : ''}
<a class="btn" href="${s.wa}">${ICONE_WA}${esc(s.boutonPage || s.bouton)}</a>
</aside>
</section>

<section class="fond-rose">
<div class="conteneur section pile pile-32">
<div class="avis-entete" style="align-items:flex-end"><h2 class="h2" style="font-size:40px">Elles en parlent</h2><a class="lien-fleche" href="${FICHE_GOOGLE}">5,0 ★ · Voir les 28 avis Google →</a></div>
<div class="grille" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px">
${avisHtml}
</div>
</div>
</section>

<section class="conteneur-etroit section pile pile-24">
<h2 class="h2" style="font-size:40px">Bon à savoir</h2>
<div class="faq">
${s.infos.map(([q, r]) => `<details><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join('\n')}
</div>
</section>

<section class="fond-blanc">
<div class="conteneur pile pile-24" style="padding-top:64px;padding-bottom:64px">
<h2 class="h2-petit">Découvrir aussi</h2>
<div class="pastilles">
${autres.map((x) => `<a href="/${x.slug}"${x.groupe === 'soins' ? ' class="sauge"' : ''}>${esc(x.nom.replace(/^L’|^Le /, (m) => (m === 'L’' ? '' : '')).replace(/^./, (c) => c.toUpperCase()))}</a>`).join('\n')}
</div>
</div>
</section>
</main>
` + pied(s.wa, s.boutonPage || s.bouton) + fin(false);
}

// ------------------------------------------------------------------
// Mentions légales (à compléter)
// ------------------------------------------------------------------
function mentions() {
  return tete({ titre: 'Mentions légales · Marie Graugnard, doula', description: 'Mentions légales et politique de confidentialité du site de Marie Graugnard, doula à Paris.', chemin: '/mentions-legales' }) + entete() + `<main class="conteneur-etroit section pile pile-16 legal">
<h1 class="h1" style="font-size:44px">Mentions légales</h1>
<h2>Éditrice du site</h2>
<p>Marie Graugnard · [Statut] · SIRET [à compléter] · [Adresse] · mariedoula75@gmail.com · 06 52 10 54 82</p>
<p>Services à la personne · Déclaration n° [à compléter]</p>
<h2>Hébergement</h2>
<p>Cloudflare, Inc. · 101 Townsend St, San Francisco, CA 94107, États-Unis · cloudflare.com</p>
<h2>Réalisation</h2>
<p>[Nom de l’agence / du créateur du site]</p>
<h2 id="confidentialite">Confidentialité</h2>
<p>Ce site ne dépose aucun cookie de suivi et ne collecte aucune donnée personnelle. Les échanges se font directement par WhatsApp, par téléphone ou par e-mail : les informations que vous partagez ne sont utilisées que pour vous répondre et organiser votre accompagnement. [À compléter et valider avant la mise en ligne.]</p>
<h2>Avis</h2>
<p>Les avis affichés proviennent de la fiche Google de Marie Graugnard et sont reproduits avec l’accord de leurs autrices. [Accord à recueillir.]</p>
</main>
` + pied() + fin(false);
}

// ------------------------------------------------------------------
// Écriture
// ------------------------------------------------------------------
rmSync(SORTIE, { recursive: true, force: true });
mkdirSync(join(SORTIE, 'images'), { recursive: true });
writeFileSync(join(SORTIE, 'index.html'), accueil());
for (const s of services) writeFileSync(join(SORTIE, `${s.slug}.html`), pageService(s));
writeFileSync(join(SORTIE, 'mentions-legales.html'), mentions());
copyFileSync('src/styles.css', join(SORTIE, 'styles.css'));
copyFileSync('src/carrousel.js', join(SORTIE, 'carrousel.js'));
copyFileSync('src/bulle.js', join(SORTIE, 'bulle.js'));
for (const f of readdirSync('src/images')) copyFileSync(join('src/images', f), join(SORTIE, 'images', f));
writeFileSync(join(SORTIE, 'robots.txt'), PREVISU ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n');
writeFileSync(join(SORTIE, '_headers'), '/images/*\n  Cache-Control: public, max-age=604800\n/*.css\n  Cache-Control: public, max-age=3600\n');
console.log(`Site généré dans ./${SORTIE} : ${services.length + 2} pages.`);
