from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):
    DEPARTMENT_CHOICES = [
        ('CSE', 'Computer Science'),
        ('EEE', 'Electrical Engineering'),
        ('CIVIL', 'Civil Engineering'),
    ]
    INTERESTED_FIELD_CHOICES = [
        # CSE
        ('AI', 'Artificial Intelligence'),
        ('DS', 'Data Science'),
        ('WD', 'Web Development'),
        ('ML', 'Machine Learning'),
        ('CP', 'Competitive Programming'),
        # EEE
        ('PE', 'Power Electronics'),
        ('CS', 'Control Systems'),
        ('VLSI', 'VLSI Design'),
        ('EE', 'Embedded Systems'),
        ('RE', 'Renewable Energy'),
        # Civil
        ('SM', 'Structural Mechanics'),
        ('TE', 'Transportation Engineering'),
        ('GE', 'Geotechnical Engineering'),
        ('HE', 'Hydraulics'),
        ('PM', 'Project Management'),
    ]
    profile_id = models.CharField(max_length=10, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100, unique=True)
    department = models.CharField(max_length=10, choices=DEPARTMENT_CHOICES)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    publications = models.FileField(upload_to='publications/', null=True, blank=True)
    interested_field = models.CharField(max_length=5, choices=INTERESTED_FIELD_CHOICES, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name','phone_number','profile_id']

    def __str__(self):
        return self.email
    
#Needs to be used when foreign key is passed    
#user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)