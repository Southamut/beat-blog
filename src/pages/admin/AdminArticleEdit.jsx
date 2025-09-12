import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminPanel } from "../../components/AdminPanel"

export function AdminArticleEdit() {
    return (
        <SidebarProvider>
            <AdminPanel />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <h1 className="text-xl font-semibold">Article Edit</h1>
                </header>
            </SidebarInset>
        </SidebarProvider>
    )
}