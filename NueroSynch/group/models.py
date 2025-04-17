from django.db import models
from django.conf import settings




class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name= "created_group")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="joined_groups", blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GroupJoinRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ]
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='join_requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_join_requests")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('group', 'requested_by')

    def __str__(self):
        return f'{self.requested_by.full_name} ({self.requested_by.email})'
    