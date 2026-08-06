import {
    ArrowRight,
    Bell,
    BellRing,
    Camera,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    ChevronUp,
    CircleHelp,
    CreditCard,
    Database,
    EllipsisVertical,
    FileText,
    Flame,
    Gem,
    Globe,
    Layers,
    LayoutDashboard,
    Lightbulb,
    Link,
    LogOut,
    Mail,
    Maximize,
    Megaphone,
    Menu,
    MessagesSquare,
    Minus,
    Moon,
    Pencil,
    Play,
    Plus,
    RefreshCw,
    Rss,
    Save,
    Search,
    Settings,
    ShoppingBag,
    Smile,
    Star,
    Sun,
    TrendingUp,
    Trash2,
    User,
    Users,
    Wallet,
    Wifi,
    X,
    Zap,
    type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

// ponytail: Material Symbols name -> lucide component. Swap string "name" API
// stays, so no call site changes needed. Upgrade path: drop map, import icons
// directly where used.
const icons: Record<string, LucideIcon> = {
    check: Check,
    public: Globe,
    bolt: Zap,
    add: Plus,
    settings: Settings,
    help: CircleHelp,
    unfold_more: ChevronsUpDown,
    person: User,
    notifications: Bell,
    logout: LogOut,
    payments: CreditCard,
    wifi: Wifi,
    arrow_drop_up: ChevronUp,
    more_vert: EllipsisVertical,
    remove: Minus,
    open_in_full: Maximize,
    face: Smile,
    close: X,
    menu: Menu,
    diamond: Gem,
    mail: Mail,
    forum: MessagesSquare,
    link: Link,
    rss_feed: Rss,
    dataset: Database,
    light_mode: Sun,
    dark_mode: Moon,
    star: Star,
    play_arrow: Play,
    group: Users,
    layers: Layers,
    dashboard: LayoutDashboard,
    query_stats: TrendingUp,
    lightbulb: Lightbulb,
    account_balance_wallet: Wallet,
    shopping_bag: ShoppingBag,
    camera_alt: Camera,
    notifications_active: BellRing,
    campaign: Megaphone,
    google: Globe,
    arrow_forward: ArrowRight,
    search: Search,
    local_fire_department: Flame,
    picture_as_pdf: FileText,
    edit: Pencil,
    trash: Trash2,
    back: ChevronLeft,
    forward: ChevronRight,
    save: Save,
    file: FileText,
    refresh: RefreshCw,
};

type IconProps = {
    name: string;
    size?: string;
    className?: string;
};

export default function Icon({
    name,
    size = 'text-2xl',
    className,
}: IconProps) {
    const LucideIcon = icons[name];

    if (!LucideIcon) {
        return null;
    }

    return (
        <LucideIcon
            aria-hidden="true"
            strokeWidth={1.75}
            className={cn('h-[1em] w-[1em] shrink-0', size, className)}
        />
    );
}