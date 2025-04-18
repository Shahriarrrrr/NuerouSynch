from rest_framework import serializers
from group.models import Group, GroupJoinRequest


class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only = True)
    members  = serializers.StringRelatedField(many = True)
    class Meta:
        model = Group
        fields = "__all__"
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)  
    

class GroupJoinRequestSerializer(serializers.ModelSerializer):
    requested_by = serializers.StringRelatedField(read_only=True)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    class Meta:
        model = GroupJoinRequest
        fields = ['id', 'group', 'requested_by', 'status', 'created_at']
        read_only_fields = ['requested_by', 'created_at']

    def create(self, validated_data):
        validated_data['requested_by'] = self.context['request'].user
        return super().create(validated_data)

class GroupJoinRequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupJoinRequest
        fields = ['status']  # Only allow status to be updated