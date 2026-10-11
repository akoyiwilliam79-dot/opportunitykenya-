
from django.contrib import admin
from django.urls import path
from .import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path("", views.home, name="home"),
    path("", views.base, name="base"),
    path("opportunities/", views.opportunities, name="opportunities"),
    path("opportunities/<slug:slug>/",views.opportunity_detail,name="opportunity_detail"),
    path("categories/", views.categories, name="categories"),
    path("about/", views.about, name="about"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("profile/", views.profile, name="profile"),
    path("saved/", views.saved_opportunities, name="saved_opportunities"),
    path("my-applications/",views.my_applications,name="my_applications"),
    path("opportunities/<int:opportunity_id>/save/",views.toggle_saved_opportunity,name="toggle_saved_opportunity",),
    path("opportunities/<int:opportunity_id>/track-application/",views.track_application,name="track_application",),
    path("my-applications/",views.my_applications,name="my_applications",),
    path("support/submit/",views.submit_support_message,name="submit_support_message",),
    path("notifications/<int:notification_id>/read/",views.mark_notification_read,name="mark_notification_read",),
    path("notifications/mark-all-read/",views.mark_all_notifications_read,name="mark_all_notifications_read",),
    path("password-change/",auth_views.PasswordChangeView.as_view(template_name="opportunity/password_change.html",success_url="/profile/",),name="password_change",),
    path("notifications/",views.notifications,name="notifications",),
    path("notifications/[int:notification_id](int:notification_id)/read/",views.mark_notification_read,name="mark_notification_read",),
    path("notifications/mark-all-read/",views.mark_all_notifications_read,name="mark_all_notifications_read",),
    path("notifications/[int:notification_id](int:notification_id)/delete/",views.delete_notification,name="delete_notification",),








]
