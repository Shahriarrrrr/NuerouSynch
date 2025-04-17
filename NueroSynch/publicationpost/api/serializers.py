from rest_framework import serializers
from publicationpost.models import PublicationPost


class PublicationPostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    class Meta:
        model = PublicationPost
        fields = "__all__"
