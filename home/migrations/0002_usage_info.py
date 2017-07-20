# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-17 09:03
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Usage_Info',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('boxNumber', models.IntegerField(default=0)),
                ('startDate', models.DateField(default=0)),
                ('finishDate', models.DateField(default=0)),
                ('price', models.IntegerField(default=0)),
                ('paymentDate', models.DateField(default=0)),
                ('boxID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.Box')),
                ('location', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='home.Location')),
                ('userID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
