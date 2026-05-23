type IconProps = { d: React.ReactNode; size?: number; stroke?: number | string; fill?: string }

const Icon = ({ d, size = 14, stroke = 1.6, fill = 'none' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
)

export const LogoIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6.5 L12 2.5 L20 6.5 L20 17.5 L12 21.5 L4 17.5 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 2.5 L12 12 L20 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.55" />
    <path d="M12 12 L12 21.5" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    <path d="M12 12 L4 6.5" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
  </svg>
)

export const TutorAvatarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M4 6.5 L12 2.5 L20 6.5 L20 17.5 L12 21.5 L4 17.5 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
  </svg>
)

export const SearchIcon = () => (
  <Icon d={<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" /></>} />
)

export const ChevronRightIcon = () => (
  <Icon d={<path d="m9 6 6 6-6 6" />} />
)

export const ChevronDownIcon = () => (
  <Icon d={<path d="m6 9 6 6 6-6" />} />
)

export const PlayIcon = () => (
  <Icon d={<path d="M7 5v14l11-7Z" />} fill="currentColor" stroke="none" />
)

export const SendIcon = () => (
  <Icon d={<><path d="M4 12 20 4 14 20l-2.5-7.5z" /><path d="M11.5 12.5 20 4" /></>} />
)

export const SparkIcon = () => (
  <Icon d={<><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="m5.5 5.5 2.8 2.8" /><path d="m15.7 15.7 2.8 2.8" /><path d="m5.5 18.5 2.8-2.8" /><path d="m15.7 8.3 2.8-2.8" /></>} />
)

export const CheckIcon = () => (
  <Icon d={<path d="m5 12 4.5 4.5L19 7" />} />
)

export const DotIcon = () => (
  <svg width="6" height="6" viewBox="0 0 6 6">
    <circle cx="3" cy="3" r="3" fill="currentColor" />
  </svg>
)

export const MoreIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </svg>
)

export const BranchIcon = () => (
  <Icon d={<><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="8" r="2" /><path d="M6 8v8" /><path d="M18 10c0 4-4 4-4 6" /></>} />
)

export const WifiIcon = () => (
  <Icon d={<><path d="M5 12.5a10 10 0 0 1 14 0" /><path d="M8.5 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></>} />
)

export const BrainIcon = () => (
  <Icon d={<><path d="M9 4a3 3 0 0 0-3 3v0a3 3 0 0 0-2 5 3 3 0 0 0 2 4v0a3 3 0 0 0 3 3 3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z" /><path d="M15 4a3 3 0 0 1 3 3v0a3 3 0 0 1 2 5 3 3 0 0 1-2 4v0a3 3 0 0 1-3 3 3 3 0 0 1-3-3" /></>} />
)

export const TestTubeIcon = () => (
  <Icon d={<><path d="M9 3v6l-5 9a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-5-9V3" /><path d="M9 3h6" /><path d="M8 14h8" /></>} />
)

export const RefreshIcon = () => (
  <Icon d={<><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" /><path d="M3 21v-5h5" /></>} />
)

export const CopyIcon = () => (
  <Icon d={<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>} />
)
