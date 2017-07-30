# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-07-30 07:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_auto_20170719_1715'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usage_info',
            old_name='boxNumber',
            new_name='additionalFee',
        ),
        migrations.RenameField(
            model_name='usage_info',
            old_name='price',
            new_name='totalPrice',
        ),
        migrations.RemoveField(
            model_name='usage_info',
            name='location',
        ),
        migrations.RemoveField(
            model_name='usage_info',
            name='paymentDate',
        ),
        migrations.AlterField(
            model_name='usage_info',
            name='startDate',
            field=models.DateField(auto_now_add=True),
        ),
    ]
