from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class Role(models.Model):
    ADMIN = 'Admin'
    OFFICER = 'Officer'
    EMPLOYEE = 'Employee'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (OFFICER, 'Officer'),
        (EMPLOYEE, 'Employee'),
    ]
    
    name = models.CharField(max_length=50, unique=True, choices=ROLE_CHOICES)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

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
        
        # Superuser defaults to Admin role if role not specified
        if 'role' not in extra_fields:
            admin_role, _ = Role.objects.get_or_create(name=Role.ADMIN)
            extra_fields['role'] = admin_role

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None # Remove username field
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
