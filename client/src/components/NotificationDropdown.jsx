import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "@/config/api.js";
import axios from "axios";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลแจ้งเตือน
  const fetchNotifications = async () => {
    // ตรวจสอบว่ามี token หรือไม่
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Disable-Global-Loading": "true"
        }
      });
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // ดึงจำนวนยังไม่อ่านสำหรับ badge
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${API_URL}/notifications/count`, {
          headers: { Authorization: `Bearer ${token}`, "X-Disable-Global-Loading": "true" },
        })
        .then((res) => setUnread(res.data?.unread || 0))
        .catch(() => {});
    }
  }, []);

  const handleOpenChange = (open) => {
    if (open) {
      // มาร์คว่าอ่านแล้วทั้งหมด และรีเฟรช
      const token = localStorage.getItem("access_token");
      if (token) {
        axios
          .post(
            `${API_URL}/notifications/read-all`,
            {},
            { headers: { Authorization: `Bearer ${token}`, "X-Disable-Global-Loading": "true" } }
          )
          .then(() => setUnread(0))
          .catch(() => {});
      }
      if (notifications.length === 0 && !loading) fetchNotifications();
    }
  };

  // เมื่อคลิกที่การแจ้งเตือน ให้ไปยังบทความที่เกี่ยวข้อง
  const handleNotificationClick = (notification) => {
    if (notification.post?.id) {
      navigate(`/post/${notification.post.id}`);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger>
        {/* Desktop bell */}
        <div className="relative border border-brown-200 hidden md:flex items-center bg-white rounded-full w-8 h-8 justify-center cursor-pointer focus:outline-none">
          <Bell className="w-5 h-5 text-brown-400" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
          )}
        </div>
        {/* Mobile bell */}
        <div className="relative flex md:hidden items-center justify-center">
          <Bell className="w-5 h-5 text-brown-400" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-screen md:w-96 border-none bg-brown-100 md:rounded-lg shadow-lg mt-4 md:mt-2 max-h-[500px] overflow-y-auto"
      >
        {loading ? (
          <div className="p-4 text-center text-brown-600">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-brown-600">No notifications</div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-2 p-4 cursor-pointer hover:bg-brown-200"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3 w-full">
                  {/* รูปโปรไฟล์ */}
                  {notification.user?.profile_pic ? (
                    <img
                      src={notification.user.profile_pic}
                      alt={notification.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brown-300 flex items-center justify-center text-brown-600 font-semibold">
                      {notification.user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  
                  {/* เนื้อหาการแจ้งเตือน */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brown-900">
                      {notification.user?.name || "User"}
                    </div>
                    <div className="text-sm text-brown-700 mt-1">
                      {notification.message}
                    </div>
                    <div className="text-xs text-orange-500 mt-1">
                      {formatTime(notification.created_at)}
                    </div>
                  </div>
                </div>
                
                {/* เส้นแบ่ง */}
                <div className="w-full border-t border-brown-200"></div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
