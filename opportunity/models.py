from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Opportunity(models.Model):

    OPPORTUNITY_TYPES = [
        ("scholarship", "Scholarship"),
        ("job", "Job"),
        ("internship", "Internship"),
        ("fellowship", "Fellowship"),
        ("grant", "Grant"),
        ("competition", "Competition"),
        ("training", "Training"),
        ("volunteering", "Volunteering"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)

    organization = models.CharField(max_length=255)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="opportunities"
    )

    opportunity_type = models.CharField(
        max_length=30,
        choices=OPPORTUNITY_TYPES
    )

    description = models.TextField()

    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    how_to_apply = models.TextField(blank=True)

    location = models.CharField(
        max_length=255,
        default="Kenya"
    )

    deadline = models.DateField(null=True, blank=True)

    application_url = models.URLField(
        max_length=500,
        blank=True
    )

    image = models.ImageField(
        upload_to="opportunities/",
        blank=True,
        null=True
    )

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    views_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    location = models.CharField(
        max_length=150,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    skills = models.TextField(
        blank=True
    )

    interests = models.TextField(
        blank=True
    )

    preferred_categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name="interested_profiles"
    )

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    email_notifications = models.BooleanField(
        default=True
    )

    deadline_notifications = models.BooleanField(
        default=True
    )

    opportunity_notifications = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}'s Profile"


class SavedOpportunity(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_opportunities"
    )

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name="saved_by_users"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "opportunity"],
                name="unique_saved_opportunity"
            )
        ]

    def __str__(self):
        return f"{self.user.username} → {self.opportunity.title}"


class Application(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("review", "Under Review"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    notes = models.TextField(
        blank=True
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-applied_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "opportunity"],
                name="unique_application"
            )
        ]

    def __str__(self):
        return f"{self.user.username} → {self.opportunity.title}"


class Notification(models.Model):

    NOTIFICATION_TYPES = [
        ("opportunity", "Opportunity"),
        ("deadline", "Deadline"),
        ("application", "Application"),
        ("account", "Account"),
        ("system", "System"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPES,
        default="system"
    )

    link = models.CharField(
        max_length=500,
        blank=True
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} → {self.title}"



class SupportMessage(models.Model):
    SUBJECT_CHOICES = [
        ("Account Help", "Account Help"),
        ("Application Support", "Application Support"),
        ("Opportunity Issue", "Opportunity Issue"),
        ("Technical Problem", "Technical Problem"),
        ("Feedback", "Feedback"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="support_messages",
    )

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(
        max_length=50,
        choices=SUBJECT_CHOICES,
    )
    message = models.TextField()

    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Support Message"
        verbose_name_plural = "Support Messages"

    def __str__(self):
        return f"{self.subject} - {self.full_name}"