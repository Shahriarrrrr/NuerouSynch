from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Define the fields to be used in displaying the CustomUser model
    model = CustomUser
    list_display = ('email', 'full_name', 'department', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'department')
    search_fields = ('email', 'full_name')
    ordering = ('email',)

    # The fields to be used in the form for adding and editing a user
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number', 'profile_id', 'profile_image', 'publications')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important Dates', {'fields': ('last_login',)}),
        ('Department Info', {'fields': ('department', 'interested_field')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'password1',
                'password2',
                'full_name',
                'phone_number',
                'department',
                'profile_id',
            ),
        }),
    )


    # Override to save the user correctly, ensuring the password is set
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.set_password(obj.password)  # Set the password if it's a new user
        super().save_model(request, obj, form, change)

# Register the CustomUser model with the CustomUserAdmin
admin.site.register(CustomUser, CustomUserAdmin)
