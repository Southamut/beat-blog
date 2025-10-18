/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner"

function ProtectedRoute({
  isLoading,
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}) {
  if (isLoading === null || isLoading) {
    // สถานะกำลังโหลดข้อมูลหรือยังไม่มีข้อมูล
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== requiredRole) {
    // คืนค่า null ขณะที่ Navigate ทำการเปลี่ยนเส้นทาง
    return <Navigate to="/login" replace />;
  }

  // ผู้ใช้มีการยืนยันตัวตนและมีบทบาทที่ถูกต้อง
  return children;
}

export default ProtectedRoute;
