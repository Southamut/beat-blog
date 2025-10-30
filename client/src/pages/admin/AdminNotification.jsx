import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminPanel } from "../../components/AdminPanel";
import { useEffect, useState } from "react";
import API_URL from "@/config/api.js";
import axios from "axios";

export function AdminNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลแจ้งเตือน
  const fetchNotifications = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Disable-Global-Loading": "true",
        },
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
  }, []);

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

  const handleNotificationClick = (notification) => {
    if (notification.post?.id) {
      window.location.href = `/post/${notification.post.id}`;
    }
  };

  return (
    <SidebarProvider>
      <AdminPanel />
      <SidebarInset>
        <header className="flex bg-brown-100 h-16 shrink-0 items-center gap-2 border-b border-brown-300 px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl text-brown-600 font-semibold">Notification</h1>
        </header>
        <main className="flex flex-col gap-4 p-8 bg-brown-100 min-h-screen">
          {loading ? (
            <div className="text-center text-brown-600 py-8">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-brown-600 py-8">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-6 cursor-pointer hover:bg-brown-50 transition-colors ${
                    index !== notifications.length - 1
                      ? "border-b border-brown-300"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Picture */}
                    {notification.user?.profile_pic ? (
                      <img
                        src={notification.user.profile_pic}
                        alt={notification.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brown-300 flex items-center justify-center text-brown-600 font-semibold text-lg">
                        {notification.user?.name?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2  font-medium">
                        <div className="text-brown-600">
                          {notification.user?.name || "User"}
                        </div>
                        <div className="text-brown-400">
                          {notification.message}
                        </div>
                        <div className="text-brown-400">
                          {notification.post?.title}
                        </div>
                      </div>

                      {notification.comment_text && (
                        <div className="text-brown-500 mt-2 mb-2 font-medium">
                          "{notification.comment_text}"
                        </div>
                      )}

                      <div className="text-sm text-orange-500">
                        {formatTime(notification.created_at)}
                      </div>
                    </div>

                    {/* View Button */}
                    <button className="text-brown-600 hover:text-brown-800 underline">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
