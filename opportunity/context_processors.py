from .models import Notification, Profile



def notification_context(request):
  if not request.user.is_authenticated:
    return {
    "navbar_notifications": [],
    "unread_notifications_count": 0,
    }


    notifications = Notification.objects.filter(
        user=request.user
    ).order_by("-created_at")

    return {
        "navbar_notifications": notifications[:5],
        "unread_notifications_count": notifications.filter(
            is_read=False
        ).count(),
    }


def global_data(request):
    context = {
        "navbar_notifications": [],
        "unread_notifications_count": 0,
        "navbar_profile": None,
    }

    if request.user.is_authenticated:
        context["navbar_notifications"] = (
            Notification.objects
            .filter(user=request.user)
            .order_by("-created_at")[:5]
        )

        context["unread_notifications_count"] = (
            Notification.objects
            .filter(user=request.user, is_read=False)
            .count()
        )

        context["navbar_profile"] = (
            Profile.objects.filter(user=request.user).first()
        )

    return context