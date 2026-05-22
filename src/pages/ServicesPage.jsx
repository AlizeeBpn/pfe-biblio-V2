import { motion } from 'framer-motion';
import {
  IconCalendarEvent,
  IconBooks,
  IconMicrophone2,
  IconPrinter,
  IconUsers,
  IconChevronRight,
  IconSparkles,
  IconMessageChatbot,
} from '@tabler/icons-react';
import { BottomNavigation } from '../components/ui/BottomNavigation';
import { RoundIcon } from '../components/ui/RoundIcon';
import Badge from '../components/ui/Badge';

/* ════════════════════════════════════════════════════
   SHADOWS
   ════════════════════════════════════════════════════ */
const SHADOW_CARD   = '0px 18px 7px rgba(142,141,143,0.01),0px 10px 6px rgba(142,141,143,0.05),0px 4px 4px rgba(142,141,143,0.09),0px 1px 2px rgba(142,141,143,0.10)';
const SHADOW_HEADER = '0px -2px 10px rgba(99,181,180,0.08), 0px 2px 10px rgba(99,181,180,0.08)';

/* ════════════════════════════════════════════════════
   SERVICE CARD
   ════════════════════════════════════════════════════ */
const SERVICES = [
  {
    id: 7,
    icon: IconMessageChatbot,
    title: 'Demander à un·e bibliothécaire',
    description: 'Réserver une communication ou demander conseil à un professionnel sur place',
    variant: 'secondary',
    badge: 'Sur place',
    badgeVariant: 'default',
  },
  {
    id: 1,
    icon: IconCalendarEvent,
    title: 'Réservation de salle',
    description: 'Salles d\'étude, de réunion et espaces de travail',
    variant: 'secondary',
    badge: 'Disponible',
    badgeVariant: 'success',
  },
  {
    id: 2,
    icon: IconBooks,
    title: 'Prêt entre bibliothèques',
    description: 'Demandez un ouvrage depuis une autre médiathèque',
    variant: 'secondary',
    badge: 'Sur demande',
    badgeVariant: 'default',
  },
  {
    id: 4,
    icon: IconMicrophone2,
    title: 'Animations culturelles',
    description: 'Conférences, lectures, rencontres avec des auteurs',
    variant: 'secondary',
    badge: 'À venir',
    badgeVariant: 'default',
  },
  {
    id: 5,
    icon: IconPrinter,
    title: 'Impression & Numérisation',
    description: 'Impression, photocopie et scan de documents',
    variant: 'neutral',
    badge: 'Sur place',
    badgeVariant: 'default',
  },
  {
    id: 6,
    icon: IconUsers,
    title: 'Ateliers & Formations',
    description: 'Ateliers numériques, aide à la recherche documentaire',
    variant: 'secondary',
    badge: 'Inscription requise',
    badgeVariant: 'default',
  },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 20 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '16px',
        padding:         '16px',
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-5)',
        borderRadius:    '16px',
        boxShadow:        SHADOW_CARD,
        cursor:          'pointer',
      }}
    >
      {/* Icon */}
      <RoundIcon icon={Icon} size="large" variant={service.variant} />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontFamily: 'var(--font-brand)', fontSize: '16px', fontWeight: 700, lineHeight: 1.3, color: 'var(--color-text-brand)', margin: 0 }}>
          {service.title}
        </p>
        <p style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4, color: 'var(--color-text-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {service.description}
        </p>
        <Badge variant={service.badgeVariant} size="small">{service.badge}</Badge>
      </div>

      <IconChevronRight size={18} strokeWidth={2} color="var(--color-text-subtle)" style={{ flexShrink: 0 }} />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */
export default function ServicesPage({ activeTab, onTabChange }) {
  return (
    <div
      className="min-h-dvh font-sans flex flex-col"
      style={{
        background:    'linear-gradient(180deg, var(--primary-2) 0%, var(--neutral-2) 49%), var(--neutral-2)',
        paddingBottom: 'var(--layout-12)',
      }}
    >

      {/* ══ HEADER ══════════════════════════════════════ */}
      <div style={{
        backgroundColor: 'var(--primary-1)',
        boxShadow:        SHADOW_HEADER,
        padding:         '20px 20px 24px',
        display:         'flex',
        flexDirection:   'column',
        gap:             '4px',
      }}>
        <p style={{ fontFamily: 'var(--font-brand)', fontSize: '26px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text-brand)', margin: 0 }}>
          Services
        </p>
        <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0 }}>
          Tous les services de la médiathèque
        </p>
      </div>

      {/* ══ COMING SOON BANNER ══════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          margin:          '20px 20px 0',
          padding:         '14px 16px',
          backgroundColor: 'var(--primary-3)',
          borderRadius:    '14px',
          border:          '1px solid var(--primary-6)',
          display:         'flex',
          alignItems:      'center',
          gap:             '10px',
        }}
      >
        <IconSparkles size={20} strokeWidth={1.8} color="var(--primary-11)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.4, color: 'var(--primary-11)', margin: 0 }}>
          Page en cours de développement — les services seront bientôt disponibles.
        </p>
      </motion.div>

      {/* ══ SERVICE LIST ════════════════════════════════ */}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>

      {/* ══ BOTTOM NAV ══════════════════════════════════ */}
      <BottomNavigation activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
