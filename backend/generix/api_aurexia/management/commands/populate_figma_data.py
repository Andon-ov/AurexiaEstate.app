"""
Management command to populate database with data from Figma design
Creates 3 destinations and 3 properties matching the Figma prototype
"""
from django.core.management.base import BaseCommand
from generix.api_aurexia.models import Destination, Property, PropertyFeature, PropertyFeatureLink


class Command(BaseCommand):
    help = 'Populate database with Figma prototype data (3 destinations, 3 properties)'

    def handle(self, *args, **kwargs):
        self.stdout.write('🚀 Populating database with Figma data...\n')

        # Create destinations
        self.stdout.write('Creating destinations...')
        
        spain = Destination.objects.update_or_create(
            slug='spain',
            defaults={
                'name_en': 'Spain',
                'name_bg': 'Испания',
                'short_description_en': 'Mediterranean luxury and timeless elegance',
                'short_description_bg': 'Средиземноморски лукс и вечна елегантност',
                'description_en': '''Spain offers an unparalleled combination of Mediterranean lifestyle, world-class architecture, and exceptional investment opportunities. From the Costa del Sol to Barcelona's cosmopolitan elegance, Spain attracts discerning investors seeking luxury properties with strong appreciation potential.''',
                'description_bg': '''Испания предлага несравнимо съчетание от средиземноморски начин на живот, световна архитектура и изключителни инвестиционни възможности. От Коста дел Сол до космополитната елегантност на Барселона, Испания привлича взискателни инвеститори, търсещи луксозни имоти със силен потенциал за покачване на стойността.''',
                'is_featured': True,
                'is_active': True,
                'order': 1,
                'hero_image': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1920&q=80',
                'thumbnail_image': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80',
            }
        )
        
        dubai = Destination.objects.update_or_create(
            slug='dubai',
            defaults={
                'name_en': 'Dubai',
                'name_bg': 'Дубай',
                'short_description_en': 'Futuristic skyline meets Arabian opulence',
                'short_description_bg': 'Футуристични хоризонти среща арабска пищност',
                'description_en': '''Dubai represents the pinnacle of modern luxury real estate. With its iconic skyline, tax-free environment, and world-class amenities, Dubai has become the premier destination for international investors seeking high-yield properties in one of the world's fastest-growing cities.''',
                'description_bg': '''Дубай представлява върха на модерния луксозен недвижим имот. Със своята емблематична силует, безмитна среда и удобства от световна класа, Дубай се превърна в първокласна дестинация за международни инвеститори, търсещи имоти с висока доходност в един от най-бързо растящите градове в света.''',
                'is_featured': True,
                'is_active': True,
                'order': 2,
                'hero_image': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
                'thumbnail_image': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
            }
        )
        
        switzerland = Destination.objects.update_or_create(
            slug='switzerland',
            defaults={
                'name_en': 'Switzerland',
                'name_bg': 'Швейцария',
                'short_description_en': 'Alpine perfection and understated luxury',
                'short_description_bg': 'Алпийско съвършенство и сдържан лукс',
                'description_en': '''Switzerland offers unmatched privacy, political stability, and breathtaking natural beauty. From exclusive ski chalets in Verbier and St. Moritz to lakeside estates in Geneva and Zürich, Swiss properties represent the ultimate in discretion and quality.''',
                'description_bg': '''Швейцария предлага несравнимо уединение, политическа стабилност и спираща дъха природна красота. От ексклузивни ски шалета във Вербие и Санкт Мориц до имоти край езерата в Женева и Цюрих, швейцарските имоти представляват върха на дискретността и качеството.''',
                'is_featured': True,
                'is_active': True,
                'order': 3,
                'hero_image': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
                'thumbnail_image': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
            }
        )
        
        self.stdout.write(self.style.SUCCESS('✓ Created 3 destinations'))

        # Create property features
        self.stdout.write('Creating property features...')
        
        bedrooms = PropertyFeature.objects.get_or_create(
            name_en='Bedrooms',
            defaults={'name_bg': 'Спални', 'icon': 'fa-bed', 'is_active': True, 'order': 1}
        )[0]
        
        bathrooms = PropertyFeature.objects.get_or_create(
            name_en='Bathrooms',
            defaults={'name_bg': 'Бани', 'icon': 'fa-bath', 'is_active': True, 'order': 2}
        )[0]
        
        area = PropertyFeature.objects.get_or_create(
            name_en='Area',
            defaults={'name_bg': 'Площ', 'icon': 'fa-ruler-combined', 'is_active': True, 'order': 3}
        )[0]
        
        pool = PropertyFeature.objects.get_or_create(
            name_en='Swimming Pool',
            defaults={'name_bg': 'Басейн', 'icon': 'fa-swimming-pool', 'is_active': True, 'order': 4}
        )[0]
        
        self.stdout.write(self.style.SUCCESS('✓ Created property features'))

        # Create properties
        self.stdout.write('Creating properties...')
        
        # Property 1: Villa Meridian
        villa_meridian = Property.objects.update_or_create(
            slug='villa-meridian',
            defaults={
                'title_en': 'Villa Meridian',
                'title_bg': 'Вила Меридиан',
                'short_description_en': 'An architectural masterpiece perched above the Mediterranean',
                'short_description_bg': 'Архитектурен шедьовър на брега на Средиземно море',
                'description_en': '''An architectural masterpiece perched above the Mediterranean, Villa Meridian represents the pinnacle of coastal luxury. This contemporary residence seamlessly blends indoor and outdoor living with floor-to-ceiling windows capturing panoramic sea views.

Featuring 6 bedrooms, 7 bathrooms, and over 800 square meters of living space, the villa includes an infinity pool, private gym, wine cellar, and home cinema. The property is situated in an exclusive gated community with 24-hour security.''',
                'description_bg': '''Архитектурен шедьовър, разположен над Средиземно море, Вила Меридиан представлява върха на крайбрежния лукс. Това съвременно жилище безупречно съчетава вътрешния и външния живот с прозорци от пода до тавана, улавящи панорамна гледка към морето.

С 6 спални, 7 бани и над 800 квадратни метра жилищна площ, вилата включва инфинити басейн, частна фитнес зала, винарска изба и домашно кино. Имотът се намира в ексклузивен затворен комплекс с 24-часова охрана.''',
                'price': 12500000,
                'price_currency': 'EUR',
                'property_type': 'villa',
                'status': 'available',
                'bedrooms': 6,
                'bathrooms': 7,
                'area_sqm': 800,
                'address': 'Marbella Golden Mile',
                'city': 'Marbella',
                'is_featured': True,
                'is_active': True,
                'order': 1,
                'destination': spain[0],
                'featured_image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
            }
        )

        
        # Property 2: Skyline Penthouse
        skyline_penthouse = Property.objects.update_or_create(
            slug='skyline-penthouse',
            defaults={
                'title_en': 'Skyline Penthouse',
                'title_bg': 'Скайлайн Пентхаус',
                'short_description_en': 'Ultra-luxury penthouse with Burj Khalifa views',
                'short_description_bg': 'Ултра-луксозен пентхаус с изглед към Бурдж Халифа',
                'description_en': '''Experience unparalleled luxury in this spectacular penthouse overlooking the Burj Khalifa and Dubai Fountain. This ultra-modern residence occupies the entire 86th floor of a prestigious tower, offering 360-degree views of Dubai's iconic skyline.

The 5-bedroom penthouse spans 650 square meters and features a private elevator, smart home automation, Italian marble throughout, and a 200-square-meter terrace with infinity pool. Building amenities include concierge service, valet parking, spa, and fine dining restaurants.''',
                'description_bg': '''Изпитайте несравним лукс в този грандиозен пентхаус с изглед към Бурдж Халифа и Дубай Фонтейн. Това ултра-модерно жилище заема целия 86-ти етаж на престижна кула, предлагайки 360-градусова гледка към емблематичния хоризонт на Дубай.

Пентхаусът с 5 спални се простира на 650 квадратни метра и разполага с частен асансьор, интелигентна домашна автоматизация, италиански мрамор навсякъде и тераса от 200 квадратни метра с инфинити басейн. Удобствата на сградата включват консиерж услуга, вале паркинг, спа център и изискани ресторанти.''',
                'price': 18000000,
                'price_currency': 'USD',
                'property_type': 'penthouse',
                'status': 'available',
                'bedrooms': 5,
                'bathrooms': 6,
                'area_sqm': 650,
                'address': 'Downtown Dubai',
                'city': 'Dubai',
                'is_featured': True,
                'is_active': True,
                'order': 2,
                'destination': dubai[0],
                'featured_image': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80',
            }
        )

        
        # Property 3: Alpine Refuge
        alpine_refuge = Property.objects.update_or_create(
            slug='alpine-refuge',
            defaults={
                'title_en': 'Alpine Refuge',
                'title_bg': 'Алпийско Убежище',
                'short_description_en': 'Ski-in/ski-out chalet with breathtaking Alpine views',
                'short_description_bg': 'Шале с директен достъп до ски писти и спиращи дъха алпийски гледки',
                'description_en': '''Nestled in the Swiss Alps with direct ski-in/ski-out access, this exceptional chalet combines traditional Alpine architecture with contemporary luxury. Floor-to-ceiling windows capture breathtaking mountain panoramas, while the interior showcases the finest materials and craftsmanship.

The 7-bedroom chalet offers 900 square meters of refined living space, including a spa area with indoor pool, sauna, hammam, and massage room. Additional features include a wine cellar, cinema room, and ski room with heated boot storage. Staff quarters and garage for 4 vehicles complete this alpine masterpiece.''',
                'description_bg': '''Сгушено в Швейцарските Алпи с директен достъп ски-in/ски-out, това изключително шале съчетава традиционна алпийска архитектура със съвременен лукс. Прозорците от пода до тавана улавят спиращи дъха планински панорами, докато интериорът демонстрира най-добрите материали и майсторство.

Шалето със 7 спални предлага 900 квадратни метра изискан жилищен простор, включващ спа зона с вътрешен басейн, сауна, хамам и стая за масажи. Допълнителните функции включват винарска изба, кино зала и ски стая със затоплено съхранение на обувки. Помещения за персонал и гараж за 4 автомобила допълват този алпийски шедьовър.''',
                'price': 22000000,
                'price_currency': 'CHF',
                'property_type': 'chalet',
                'status': 'available',
                'bedrooms': 7,
                'bathrooms': 8,
                'area_sqm': 900,
                'address': 'Verbier Ski Resort',
                'city': 'Verbier',
                'is_featured': True,
                'is_active': True,
                'order': 3,
                'destination': switzerland[0],
                'featured_image': 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1920&q=80',
            }
        )

        
        self.stdout.write(self.style.SUCCESS('✓ Created 3 featured properties'))

        self.stdout.write(self.style.SUCCESS('\n🎉 Database populated successfully!'))
        self.stdout.write('Properties: 3 featured')
        self.stdout.write('Destinations: 3 featured')
        self.stdout.write('\nYou can now view them at:')
        self.stdout.write('  - Frontend: http://aurexia.run.place')
        self.stdout.write('  - API: http://aurexia.run.place/api/aurexia/properties/featured/')
        self.stdout.write('  - Admin: http://aurexia.run.place/admin/')
