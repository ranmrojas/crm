import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Home, Store, Package, Settings, LogOut, ChevronDown, ChevronRight, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useTextSize } from '../context/TextSizeContext'

type MenuItem = {
  icon: React.ElementType
  label: string
  href: string
  subItems?: { label: string; href: string }[]
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [showAccountPopup, setShowAccountPopup] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const popupRef = useRef<HTMLDivElement>(null)
  const { sidebarTextSize } = useTextSize()

  const formatRole = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrador'
      case 'admin':
        return 'Administrador'
      case 'vendedor':
        return 'Vendedor'
      case 'usuariojr':
        return 'Usuario Jr'
      default:
        return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleExpand = (label: string) => setExpandedItem(expandedItem === label ? null : label)
  const toggleAccountPopup = () => setShowAccountPopup(!showAccountPopup)

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { 
      icon: Store, 
      label: 'Sucursales',
      href: '/dashboard/stores',
      subItems: [
        { label: 'Ver Sucursales', href: '/dashboard/stores' },
        { label: 'Nueva Sucursal', href: '/dashboard/stores/new' },
      ]
    },
    { icon: Package, label: 'Productos', href: '/dashboard/products' },
    { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    localStorage.removeItem('next-auth.session-token')
    router.push('/auth/login')
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowAccountPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getTextSizeClass = () => {
    switch (sidebarTextSize) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-16' : 'w-64'}
        transition-all duration-300 ease-in-out
        bg-white text-gray-700
        flex flex-col
        border-r border-gray-200
        relative
      `}
    >
      <div className="p-4 border-b border-gray-200 text-center font-semibold">
        {isCollapsed ? (
          <span className="text-xl">{session?.user?.currentCompany?.name?.charAt(0)}</span>
        ) : (
          <span>{session?.user?.currentCompany?.name}</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>
                <a
                  className={`
                    flex items-center w-full px-4 py-2 text-left
                    ${router.pathname === item.href ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-50'}
                    ${isCollapsed ? 'justify-center' : ''}
                    ${getTextSizeClass()}
                  `}
                  onClick={() => item.subItems && toggleExpand(item.label)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.subItems && (
                        expandedItem === item.label ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </>
                  )}
                </a>
              </Link>
              {!isCollapsed && item.subItems && expandedItem === item.label && (
                <ul className="bg-gray-50 py-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subItem.href}>
                        <a
                          className={`
                            block pl-12 pr-4 py-2
                            ${router.pathname === subItem.href ? 'text-blue-600' : 'hover:bg-gray-100'}
                            ${getTextSizeClass()}
                          `}
                        >
                          {subItem.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-2 border-t border-gray-200 ${isCollapsed ? 'flex flex-col items-center' : 'flex justify-between items-center'}`}>
        <button
          onClick={toggleAccountPopup}
          className="text-gray-500 hover:text-gray-700 p-1 relative"
        >
          <User size={20} />
          {showAccountPopup && (
            <div 
              ref={popupRef}
              className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
            >
              <h3 className="font-bold text-sm mb-1">{session?.user?.currentCompany?.name}</h3>
              <p className="text-xs mb-1">Sucursal: {session?.user?.currentStore?.name}</p>
              <p className="text-xs font-semibold mb-1">{session?.user?.name}</p>
              <p className="text-xs text-gray-600 mb-1">{session?.user?.email}</p>
              <p className="text-xs font-medium text-blue-600 mb-1">
                {session?.user?.role ? formatRole(session.user.role) : 'Usuario'}
              </p>
              <Link href="/dashboard/account">
                <a className="text-blue-600 hover:underline text-xs">Cuenta</a>
              </Link>
            </div>
          )}
        </button>
        <button
          onClick={handleLogout}
          className={`
            flex items-center justify-center rounded-lg
            bg-gray-100 hover:bg-gray-200 p-1
            ${isCollapsed ? 'mt-2' : ''}
          `}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className={`ml-2 ${getTextSizeClass()}`}>Cerrar Sesión</span>}
        </button>
      </div>

      <button
        onClick={toggleCollapse}
        className="absolute top-2 -right-3 bg-white rounded-full p-1 shadow-md"
      >
        {isCollapsed ? '→' : '←'}
      </button>
    </aside>
  )
}