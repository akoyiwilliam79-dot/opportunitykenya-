from django.contrib import admin
from .models import *
from .models import SupportMessage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organization",
        "category",
        "opportunity_type",
        "location",
        "deadline",
        "is_featured",
        "is_published",
        "created_at",
    )

    list_filter = (
        "opportunity_type",
        "category",
        "location",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "title",
        "organization",
        "description",
        "location",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    readonly_fields = (
        "views_count",
        "created_at",
        "updated_at",
    )

    ordering = ("-created_at",)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "phone",
        "location",
        "email_notifications",
        "deadline_notifications",
        "opportunity_notifications",
        "created_at",
    )

    list_filter = (
        "email_notifications",
        "deadline_notifications",
        "opportunity_notifications",
    )

    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
        "phone",
        "location",
    )

    filter_horizontal = ("preferred_categories",)


@admin.register(SavedOpportunity)
class SavedOpportunityAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "opportunity",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "opportunity__title",
    )

    list_filter = ("created_at",)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "opportunity",
        "status",
        "applied_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "applied_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "opportunity__title",
    )

    readonly_fields = (
        "applied_at",
        "updated_at",
    )


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "title",
        "notification_type",
        "is_read",
        "created_at",
    )

    list_filter = (
        "notification_type",
        "is_read",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "title",
        "message",
    )

    readonly_fields = ("created_at",)


@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "subject",
        "is_resolved",
        "created_at",
    )

    list_filter = ("subject", "is_resolved", "created_at")
    search_fields = ("full_name", "email", "message")
    readonly_fields = ("created_at",)