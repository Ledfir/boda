import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DemoBadge } from '@/components/common/DemoNotice';
import AdminRsvpTab from '@/components/admin/AdminRsvpTab';
import AdminDedicationsTab from '@/components/admin/AdminDedicationsTab';
import AdminPhotosTab from '@/components/admin/AdminPhotosTab';
import AdminConfigTab from '@/components/admin/AdminConfigTab';
import { useAuth } from '@/lib/AuthContext';
import { weddingConfig } from '@/config/wedding';

const TAB_TRIGGER =
  'text-[0.66rem] uppercase tracking-wide-luxe text-background/60 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none';

/** Panel privado de administración de la boda. */
export default function Admin() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[100svh] bg-foreground text-background">
      <header className="border-b border-background/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[0.6rem] uppercase tracking-luxe text-primary">Panel privado</p>
            <h1 className="mt-2 font-heading text-xl text-background sm:text-2xl">
              {weddingConfig.couple.display}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <DemoBadge className="border-primary/50 text-primary" />
            <Link
              to="/"
              className="text-[0.66rem] uppercase tracking-wide-luxe text-background/70 transition hover:text-primary"
            >
              Ver invitación
            </Link>
            {user?.email && (
              <span className="hidden text-xs text-background/50 sm:inline">{user.email}</span>
            )}
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 border border-background/25 px-4 py-2 text-[0.66rem] uppercase tracking-wide-luxe text-background transition hover:border-primary hover:text-primary"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Tabs defaultValue="confirmaciones" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 border-b border-background/15 bg-transparent p-0 pb-3">
            <TabsTrigger value="confirmaciones" className={TAB_TRIGGER}>
              Confirmaciones
            </TabsTrigger>
            <TabsTrigger value="dedicatorias" className={TAB_TRIGGER}>
              Dedicatorias
            </TabsTrigger>
            <TabsTrigger value="fotografias" className={TAB_TRIGGER}>
              Fotografías de invitados
            </TabsTrigger>
            <TabsTrigger value="configuracion" className={TAB_TRIGGER}>
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="confirmaciones" className="mt-8">
            <AdminRsvpTab />
          </TabsContent>
          <TabsContent value="dedicatorias" className="mt-8">
            <AdminDedicationsTab />
          </TabsContent>
          <TabsContent value="fotografias" className="mt-8">
            <AdminPhotosTab />
          </TabsContent>
          <TabsContent value="configuracion" className="mt-8">
            <AdminConfigTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}