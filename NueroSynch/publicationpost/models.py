from django.db import models
from django.conf import settings 

# Create your models here.
class PublicationPost(models.Model):
    title = models.CharField(max_length=100)
    description =  models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post")
    created_at = models.DateTimeField(auto_now_add=True)
    publications = models.FileField(upload_to='post/', null=True, blank=True)
    def __str__(self):
          return self.title




# from django.conf import settings 
# from django.contrib.auth.models import User

# class Research_post(models.Model):
#     title = models.CharField(max_length=200)
#     description = models.CharField(max_length=150)
#     # Creator of the post (one user)
#     # author = models.ForeignKey(
#     #     settings.AUTH_USER_MODEL,
#     #     on_delete=models.CASCADE,
#     #     related_name='research_posts'
#     # )

#     # Collaborators (many users)
#     collaborators = models.CharField(max_length=100, default=None)
#     created_at = models.DateTimeField(auto_now_add=True)
#     def __str__(self):
#         return self.title
    

# class Comment(models.Model):
#     post = models.ForeignKey(Research_post, on_delete=models.CASCADE, related_name='comments')
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     # author = models.CharField(max_length=100)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     # def __str__(self):
#     #     return f"Comment by {self.author.username} on {self.post.title}"