# Generated by Django 3.2.19 on 2024-01-11 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chargingstations', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Charger',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chgerId', models.CharField(max_length=50)),
                ('chgerType', models.CharField(max_length=50)),
                ('stat', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'Charger',
            },
        ),
        migrations.RemoveField(
            model_name='chargingstation',
            name='location',
        ),
        migrations.RemoveField(
            model_name='chargingstation',
            name='name',
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='addr',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='lat',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='lng',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='parkingFree',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='statId',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='statNm',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='statUpdDt',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='useTime',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='chargingstation',
            name='charger',
            field=models.ManyToManyField(to='chargingstations.Charger'),
        ),
    ]
