import Link from "next/link";
import {
  BarChart3Icon,
  BoxesIcon,
  ChefHatIcon,
  CreditCardIcon,
  LayoutGridIcon,
  QrCodeIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

const modules = [
  { title: "POS", description: "Menu visual, variantes, modificadores, descuentos y cobro.", icon: ShoppingCartIcon },
  { title: "Cocina KDS", description: "Tickets de cocina y estados de preparación.", icon: ChefHatIcon },
  { title: "Mesas", description: "Ocupación, disposición de salón y QR por mesa.", icon: LayoutGridIcon },
  { title: "Inventario", description: "Stock, movimientos, alertas y consumo por recetas.", icon: BoxesIcon },
  { title: "Facturación", description: "Liquidación, métodos de pago y comprobante térmico.", icon: CreditCardIcon },
  { title: "Auto pedido QR", description: "Pedido del cliente desde su mesa y seguimiento del estado.", icon: QrCodeIcon },
  { title: "Personal", description: "Roles operativos, acceso por PIN y gestión de staff.", icon: UsersIcon },
  { title: "Analítica", description: "Ventas, ticket promedio, mix de pagos y tendencias.", icon: BarChart3Icon },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
              Laboratorio aislado · ElitaleRestro
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Restaurant POS Benchmark</h1>
            <p className="mt-4 max-w-2xl text-zinc-400">
              Vista de evaluación del sistema original para revisar arquitectura, flujos y UX antes de decidir qué ideas conviene recrear en Altamis.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950">
              Ir al login original
            </Link>
            <Link href="/admin" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold">
              Vista admin
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-zinc-800">
                <Icon className="size-5" />
              </div>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-900/60 bg-amber-950/30 p-5 text-sm leading-6 text-amber-100/80">
          <strong className="text-amber-100">Modo laboratorio:</strong> esta portada puede desplegarse sin base de datos. Las pantallas operativas originales sí necesitan PostgreSQL y datos iniciales; cuando conectemos una base temporal podremos recorrer POS, KDS, mesas, inventario y los demás flujos con información real de prueba.
        </div>
      </div>
    </main>
  );
}
