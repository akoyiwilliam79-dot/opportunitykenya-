from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from .models import *
from datetime import date, timedelta
from django.db.models import Q
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.db import models
from django.views.decorators.http import require_POST
from django.db.models import Count
from django.db.models import Count, Q







def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(
            request,
            username=email,
            password=password
        )

        if user is not None:
            login(request, user)
            return redirect("dashboard")

        messages.error(
            request,
            "Invalid email or password. Please try again."
        )

    return render(request, "opportunity/login.html")



def register(request):

    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":

        full_name = request.POST.get("full_name", "").strip()
        email = request.POST.get("email", "").strip().lower()
        password = request.POST.get("password", "")
        confirm_password = request.POST.get("confirm_password", "")

        # Validate full name
        if not full_name:
            messages.error(request, "Please enter your full name.")
            return render(request, "opportunity/register.html")

        # Validate email
        if not email:
            messages.error(request, "Please enter your email address.")
            return render(request, "opportunity/register.html")

        # Validate password match
        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, "opportunity/register.html")

        # Validate password length
        if len(password) < 8:
            messages.error(
                request,
                "Password must contain at least 8 characters."
            )
            return render(request, "opportunity/register.html")

        # Check existing username
        if User.objects.filter(username=email).exists():
            messages.error(
                request,
                "An account with this email already exists."
            )
            return render(request, "opportunity/register.html")

        # Check existing email
        if User.objects.filter(email=email).exists():
            messages.error(
                request,
                "An account with this email already exists."
            )
            return render(request, "opportunity/register.html")

        # Split full name
        name_parts = full_name.split()
        first_name = name_parts[0]
        last_name = " ".join(name_parts[1:])

        # Create account without logging the user in
        User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Display success message
        messages.success(
            request,
            "Your account has been created successfully! Please log in."
        )

        # Redirect to login page
        return redirect("login")

    return render(request, "opportunity/register.html")


def logout_view(request):
    logout(request)

    messages.success(
        request,
        "You have been logged out successfully."
    )

    return redirect("login")

@login_required(login_url="login")
def dashboard(request):
    return render(
        request,
        "opportunity/dashboard.html"
    )


def home(request):
    # Get published opportunities
    published_opportunities = Opportunity.objects.filter(
        is_published=True
    ).select_related("category")

    # Get featured opportunities
    featured_opportunities = published_opportunities.filter(
        is_featured=True
    ).order_by("-created_at")[:3]

    # Get active categories
    active_categories = Category.objects.filter(
        is_active=True
    ).order_by("name")

    # Calculate real platform statistics
    total_opportunities = published_opportunities.count()

    total_organizations = (
        published_opportunities
        .values("organization")
        .distinct()
        .count()
    )

    total_categories = active_categories.count()

    # Find opportunities already saved by the logged-in user
    saved_opportunity_ids = set()

    if request.user.is_authenticated:
        saved_opportunity_ids = set(
            SavedOpportunity.objects.filter(
                user=request.user
            ).values_list("opportunity_id", flat=True)
        )

    context = {
        "featured_opportunities": featured_opportunities,
        "categories": active_categories,
        "total_opportunities": total_opportunities,
        "total_organizations": total_organizations,
        "total_categories": total_categories,
        "saved_opportunity_ids": saved_opportunity_ids,
    }

    return render(request, "opportunity/home.html", context)

def base(request):
    return render(request, "opportunity/base.html")



def opportunities(request):

    opportunities_list = (
        Opportunity.objects
        .filter(is_published=True)
        .select_related("category")
    )

    # -------------------------
    # SEARCH
    # -------------------------

    search_query = request.GET.get("q", "").strip()

    if search_query:
        opportunities_list = opportunities_list.filter(
            Q(title__icontains=search_query)
            | Q(organization__icontains=search_query)
            | Q(description__icontains=search_query)
            | Q(location__icontains=search_query)
            | Q(category__name__icontains=search_query)
        )

    # -------------------------
    # CATEGORY
    # -------------------------

    category_slug = request.GET.get("category", "").strip()

    if category_slug:
        opportunities_list = opportunities_list.filter(
            category__slug=category_slug
        )

    # -------------------------
    # LOCATION
    # -------------------------

    location = request.GET.get("location", "").strip()

    if location:
        opportunities_list = opportunities_list.filter(
            location__icontains=location
        )

    # -------------------------
    # OPPORTUNITY TYPE
    # -------------------------

    opportunity_type = request.GET.get("type", "").strip()

    if opportunity_type:
        opportunities_list = opportunities_list.filter(
            opportunity_type=opportunity_type
        )

    # -------------------------
    # DEADLINE
    # -------------------------

    deadline_filter = request.GET.get("deadline", "").strip()

    today = date.today()

    if deadline_filter == "7":

        opportunities_list = opportunities_list.filter(
            deadline__gte=today,
            deadline__lte=today + timedelta(days=7)
        )

    elif deadline_filter == "30":

        opportunities_list = opportunities_list.filter(
            deadline__gte=today,
            deadline__lte=today + timedelta(days=30)
        )

    elif deadline_filter == "expired":

        opportunities_list = opportunities_list.filter(
            deadline__lt=today
        )

    # -------------------------
    # SORTING
    # -------------------------

    sort = request.GET.get("sort", "latest")

    if sort == "oldest":

        opportunities_list = opportunities_list.order_by(
            "created_at"
        )

    elif sort == "deadline":

        opportunities_list = opportunities_list.order_by(
            "deadline",
            "-created_at"
        )

    elif sort == "title":

        opportunities_list = opportunities_list.order_by(
            "title"
        )

    else:

        opportunities_list = opportunities_list.order_by(
            "-created_at"
        )

    # -------------------------
    # PAGINATION
    # -------------------------

    paginator = Paginator(
        opportunities_list,
        10
    )

    page_number = request.GET.get("page")

    page_obj = paginator.get_page(
        page_number
    )

    # -------------------------
    # CATEGORIES
    # -------------------------

    categories_list = Category.objects.filter(
        is_active=True
    ).order_by("name")
    saved_opportunity_ids = set()

    if request.user.is_authenticated:
        saved_opportunity_ids = set(
            SavedOpportunity.objects.filter(
                user=request.user
            ).values_list(
                "opportunity_id",
                flat=True
            )
        )
    return render(
        request,
        "opportunity/opportunities.html",
        {
            "opportunities": page_obj,
            "page_obj": page_obj,
            "categories": categories_list,

            "search_query": search_query,
            "selected_category": category_slug,
            "selected_location": location,
            "selected_type": opportunity_type,
            "selected_deadline": deadline_filter,
            "selected_sort": sort,
            "saved_opportunity_ids": saved_opportunity_ids,
        },
    )




@login_required
def toggle_saved_opportunity(request, opportunity_id):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid request method."
            },
            status=405
        )

    opportunity = get_object_or_404(
        Opportunity,
        id=opportunity_id,
        is_published=True
    )

    saved_opportunity, created = SavedOpportunity.objects.get_or_create(
        user=request.user,
        opportunity=opportunity
    )

    if created:

        return JsonResponse({
            "success": True,
            "saved": True,
            "message": "Opportunity saved."
        })

    saved_opportunity.delete()

    return JsonResponse({
        "success": True,
        "saved": False,
        "message": "Opportunity removed from saved opportunities."
    })

    
def opportunity_detail(request, slug):
    opportunity = get_object_or_404(
        Opportunity.objects.select_related("category"),
        slug=slug,
        is_published=True,
    )

    # Increase view count
    Opportunity.objects.filter(pk=opportunity.pk).update(
        views_count=opportunity.views_count + 1
    )

    return render(
        request,
        "opportunity/opportunity_detail.html",
        {
            "opportunity": opportunity,
        },
    )


def categories(request):
    categories_list = (
        Category.objects
        .filter(is_active=True)
        .prefetch_related("opportunities")
    )

    return render(
        request,
        "opportunity/categories.html",
        {
            "categories": categories_list,
        },
    )



def about(request):
    categories = Category.objects.all()

    context = {
        "categories": categories,
    }

    return render(request, "opportunity/about.html", context)

@login_required
def profile(request):
    profile_obj, created = Profile.objects.get_or_create(
        user=request.user
    )

    if request.method == "POST":
        # Update user account information
        request.user.first_name = request.POST.get(
            "first_name", ""
        ).strip()

        request.user.last_name = request.POST.get(
            "last_name", ""
        ).strip()

        request.user.email = request.POST.get(
            "email", ""
        ).strip()

        request.user.save()

        # Update profile information
        profile_obj.phone = request.POST.get(
            "phone", ""
        ).strip()

        profile_obj.location = request.POST.get(
            "location", ""
        ).strip()

        profile_obj.bio = request.POST.get(
            "bio", ""
        ).strip()

        profile_obj.skills = request.POST.get(
            "skills", ""
        ).strip()

        profile_obj.interests = request.POST.get(
            "interests", ""
        ).strip()

        # Save notification preferences
        profile_obj.email_notifications = (
            request.POST.get("email_notifications") == "on"
        )

        profile_obj.deadline_notifications = (
            request.POST.get("deadline_notifications") == "on"
        )

        profile_obj.opportunity_notifications = (
            request.POST.get("opportunity_notifications") == "on"
        )

        # Update profile picture if one was uploaded
        if request.FILES.get("profile_picture"):
            profile_obj.profile_picture = request.FILES[
                "profile_picture"
            ]

        profile_obj.save()

        # Update preferred categories
        selected_categories = request.POST.getlist(
            "preferred_categories"
        )

        profile_obj.preferred_categories.set(
            Category.objects.filter(
                id__in=selected_categories,
                is_active=True,
            )
        )

        messages.success(
            request,
            "Your profile has been updated successfully!"
        )

        return redirect("profile")

    # Get available categories
    categories = Category.objects.filter(
        is_active=True
    ).order_by("name")

    selected_categories = list(
        profile_obj.preferred_categories.values_list(
            "id", flat=True
        )
    )

    # Calculate profile completion
    completion_fields = [
        request.user.first_name,
        request.user.last_name,
        request.user.email,
        profile_obj.phone,
        profile_obj.location,
        profile_obj.bio,
        profile_obj.skills,
        profile_obj.interests,
    ]

    completed_fields = sum(
        bool(value) for value in completion_fields
    )

    profile_completion = round(
        completed_fields / len(completion_fields) * 100
    )

    context = {
        "profile": profile_obj,
        "categories": categories,
        "selected_categories": selected_categories,
        "profile_completion": profile_completion,
    }

    return render(
        request,
        "opportunity/profile.html",
        context,
    )
@login_required
def saved_opportunities(request):
    saved_opportunities_list = (
        SavedOpportunity.objects
        .filter(
            user=request.user,
            opportunity__is_published=True,
        )
        .select_related(
            "opportunity",
            "opportunity__category",
        )
    )

    return render(
        request,
        "opportunity/saved_opportunities.html",
        {
            "saved_opportunities": saved_opportunities_list,
              "today": date.today(),
        },
    )

@login_required
def my_applications(request):
    # Fetch applications belonging to the logged-in user.
    applications = (
        Application.objects
        .filter(user=request.user)
        .select_related(
            "opportunity",
            "opportunity__category",
        )
        .order_by("-applied_at")
    )

    # Calculate application statistics.
    application_stats = applications.aggregate(
        total=Count("id"),
        pending=Count(
            "id",
            filter=models.Q(status="pending"),
        ),
        review=Count(
            "id",
            filter=models.Q(status="review"),
        ),
        accepted=Count(
            "id",
            filter=models.Q(status="accepted"),
        ),
        rejected=Count(
            "id",
            filter=models.Q(status="rejected"),
        ),
    )

    # Fetch notifications for the logged-in user.
    notifications = Notification.objects.filter(
        user=request.user
    ).order_by("-created_at")

    unread_notifications_count = notifications.filter(
        is_read=False
    ).count()

    context = {
        "applications": applications,
        "application_stats": application_stats,
        "notifications": notifications,
        "unread_notifications_count": unread_notifications_count,
        "today": date.today(),
    }

    return render(
        request,
        "opportunity/my_applications.html",
        context,
    )


@login_required
@require_POST
def submit_support_message(request):
    full_name = request.POST.get("full_name", "").strip()
    email = request.POST.get("email", "").strip()
    subject = request.POST.get("subject", "").strip()
    message = request.POST.get("message", "").strip()

    if not all([full_name, email, subject, message]):
        messages.error(
            request,
            "Please complete every field before submitting your message.",
        )
        return redirect("/my-applications/#contact-section")

    valid_subjects = dict(SupportMessage.SUBJECT_CHOICES)

    if subject not in valid_subjects:
        messages.error(request, "Please select a valid support subject.")
        return redirect("/my-applications/#contact-section")

    SupportMessage.objects.create(
        user=request.user,
        full_name=full_name,
        email=email,
        subject=subject,
        message=message,
    )

    messages.success(
        request,
        "Your support message has been submitted successfully.",
    )

    return redirect("/my-applications/#contact-section")



@login_required
@require_POST
def mark_notification_read(request, notification_id):
    notification = Notification.objects.filter(
        id=notification_id,
        user=request.user,
    ).first()

    if notification:
        notification.is_read = True
        notification.save(update_fields=["is_read"])

    return redirect("/my-applications/#notifications-section")


@login_required
@require_POST
def mark_all_notifications_read(request):
    Notification.objects.filter(
        user=request.user,
        is_read=False,
    ).update(is_read=True)

    messages.success(
        request,
        "All notifications have been marked as read.",
    )

    return redirect("/my-applications/#notifications-section")

@login_required
def track_application(request, opportunity_id):
    if request.method != "POST":
        return redirect(
            "opportunity_detail",
            slug=get_object_or_404(
                Opportunity,
                id=opportunity_id,
                is_published=True,
            ).slug,
        )

    opportunity = get_object_or_404(
        Opportunity,
        id=opportunity_id,
        is_published=True,
    )

    # Prevent recording applications after the deadline.
    if opportunity.deadline and opportunity.deadline < date.today():
        messages.error(
            request,
            "The application deadline for this opportunity has passed.",
        )
        return redirect("opportunity_detail", slug=opportunity.slug)

    application, created = Application.objects.get_or_create(
        user=request.user,
        opportunity=opportunity,
        defaults={"status": "pending"},
    )

    if created:
        messages.success(
            request,
            "Your application has been added to My Applications. "
            "Remember, this records your application and does not confirm "
            "submission on the external website.",
        )
    else:
        messages.info(
            request,
            "This opportunity is already listed in My Applications.",
        )

    return redirect("my_applications")



@login_required
def notifications(request):
    notification_list = Notification.objects.filter(
        user=request.user
    ).order_by("-created_at")

    unread_notifications_count = notification_list.filter(
        is_read=False
    ).count()

    context = {
        "notifications": notification_list,
        "unread_notifications_count": unread_notifications_count,
    }

    return render(
        request,
        "opportunity/notifications.html",
        context,
    )



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

@login_required
@require_POST
def mark_notification_read(request, notification_id):
    notification = get_object_or_404(
    Notification,
    id=notification_id,
    user=request.user,
    )

    notification.is_read = True
    notification.save(update_fields=["is_read"])

    messages.success(request, "Notification marked as read.")

    return redirect("notifications")

@login_required
@require_POST
def mark_all_notifications_read(request):
    Notification.objects.filter(
    user=request.user,
    is_read=False,
    ).update(is_read=True)


    messages.success(
        request,
        "All notifications have been marked as read.",
    )

    return redirect("notifications")


@login_required
@require_POST
def delete_notification(request, notification_id):
    notification = get_object_or_404(
    Notification,
    id=notification_id,
    user=request.user,
    )


    notification.delete()

    messages.success(request, "Notification deleted.")

    return redirect("notifications")
