from datetime import datetime, timezone
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from database import SessionLocal, init_db
from app.models.user import User
from app.models.water_body import WaterBody, Observation
from app.models.aquifer import Aquifer
from app.models.heat_zone import HeatZone
from app.models.community import Community, CommunityMember, CommunityPost, Comment
from app.models.activity import Activity, ActivityParticipation, ActivityImpact
from app.models.report import EnvironmentalReport
from app.services.auth import hash_password


def seed_users(db: Session):
    """Ensures base seed demo accounts exist in PostgreSQL for existing references."""
    demo_users = [
        {
            "id": "user-1",
            "name": "Maya Sharma",
            "email": "maya.sharma@jal-dharani.org",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "role": "community_lead",
            "city": "Pune",
            "state": "Maharashtra",
            "neighborhood": "Kothrud",
            "bio": "Grassroots water conservation coordinator and geology educator.",
        },
        {
            "id": "user-2",
            "name": "Arjun Nambiar",
            "email": "arjun.n@ecowater.in",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "role": "volunteer",
            "city": "Bengaluru",
            "state": "Karnataka",
            "neighborhood": "Whitefield",
            "bio": "Citizen hydrology volunteer documenting lake encroachment, foam barriers, and stormwater inlets.",
        },
        {
            "id": "user-3",
            "name": "Priya Verma",
            "email": "priya.verma@delhiwaters.org",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "role": "hydrologist",
            "city": "New Delhi",
            "state": "Delhi",
            "neighborhood": "Vasant Kunj",
            "bio": "Groundwater hydrologist specializing in alluvial aquifer recharge dynamics.",
        },
    ]

    default_password_hash = hash_password("JalDharani2026!")

    for u_data in demo_users:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            user = User(
                id=u_data["id"],
                email=u_data["email"],
                password_hash=default_password_hash,
                name=u_data["name"],
                avatar=u_data["avatar"],
                role=u_data["role"],
                city=u_data["city"],
                state=u_data["state"],
                neighborhood=u_data["neighborhood"],
                bio=u_data["bio"],
            )
            db.add(user)
    db.commit()


def seed_database(db: Session = None):
    """Populates PostgreSQL + PostGIS with the Jal-Dharani development/demo datasets."""
    close_db = False
    if db is None:
        init_db()
        db = SessionLocal()
        close_db = True

    try:
        # Always ensure user records exist for referential integrity
        seed_users(db)

        # Check if environmental data already seeded
        if db.query(WaterBody).first():
            print("[Jal-Dharani Seeder]: Environmental data already seeded. Ensuring users synced.")
            return

        print("[Jal-Dharani Seeder]: Seeding development/demo environmental data...")

        # 1. WATER BODIES
        wb_godavari = WaterBody(
            id="wb-1",
            name="Godavari River (Nashik Stretch)",
            local_name="Dakshin Ganga",
            type="river",
            city="Nashik",
            state="Maharashtra",
            basin="Godavari Basin",
            latitude=19.9975,
            longitude=73.7898,
            location_geom=from_shape(Point(73.7898, 19.9975), srid=4326),
            description="Second longest river course in India, originating at Trimbakeshwar. The Nashik urban stretch experiences heavy episodic solid waste and domestic sewage outflows.",
            historical_context="Historically sustained riparian stepwells (kunds) and traditional ghat storage systems.",
            dissolved_oxygen_mg_l=4.8,
            ph=7.4,
            bod_mg_l=6.2,
            tds_mg_l=420.0,
            turbidity_ntu=14.0,
            official_source="CPCB National Water Quality Monitoring Programme (NWMP) - Station 1024",
            compliance_status="Moderate Concern",
            quality_last_updated="2026-08-28",
            pollution_severity="Moderate",
            primary_pollutants=["Untreated greywater drains", "Single-use plastic remnants", "Floral & religious debris"],
            pollution_summary="Biochemical Oxygen Demand intermittently exceeds 5 mg/L near Ramkund ghat due to legacy drainage culverts.",
            photos=[],
            is_demo_data=True,
        )

        wb_bellandur = WaterBody(
            id="wb-2",
            name="Bellandur Lake",
            local_name="Bellanduru Kere",
            type="lake",
            city="Bengaluru",
            state="Karnataka",
            basin="Ponnaiyar / Dakshina Pinakini Basin",
            latitude=12.9366,
            longitude=77.6713,
            location_geom=from_shape(Point(77.6713, 12.9366), srid=4326),
            description="Largest interconnected water body in Bengaluru city, receiving runoff from an urban catchment of over 280 sq km.",
            historical_context="Constructed in the 10th century during the Western Ganga dynasty as an interconnected gravity tank cascade.",
            dissolved_oxygen_mg_l=2.1,
            ph=8.2,
            bod_mg_l=18.5,
            tds_mg_l=680.0,
            turbidity_ntu=38.0,
            official_source="Karnataka State Pollution Control Board (KSPCB) / WRIS",
            compliance_status="Severe Degradation",
            quality_last_updated="2026-09-02",
            pollution_severity="Critical",
            primary_pollutants=["High phosphates & surfactant foaming", "Water hyacinth biomass", "Industrial effluent trace metals"],
            pollution_summary="Severely suppressed dissolved oxygen (<3 mg/L) impedes fish survival. Community-built floating wetlands show localized clarification.",
            photos=[],
            is_demo_data=True,
        )

        wb_yamuna = WaterBody(
            id="wb-3",
            name="Yamuna River (Delhi Okhla Stretch)",
            local_name="Kalindi",
            type="river",
            city="Delhi NCR",
            state="Delhi",
            basin="Ganga-Yamuna Basin",
            latitude=28.5447,
            longitude=77.3072,
            location_geom=from_shape(Point(77.3072, 28.5447), srid=4326),
            description="Crucial lifeline flowing through India's capital. The 22-km urban stretch between Wazirabad and Okhla barrage historically accounted for over 70% of its total pollution load.",
            historical_context="Vast floodplain was historically an unpaved alluvial sponge that absorbed high monsoon spates.",
            dissolved_oxygen_mg_l=1.4,
            ph=7.9,
            bod_mg_l=24.0,
            tds_mg_l=820.0,
            turbidity_ntu=45.0,
            official_source="Delhi Pollution Control Committee (DPCC) / CPCB Realtime Station",
            compliance_status="Severe Degradation",
            quality_last_updated="2026-09-12",
            pollution_severity="Critical",
            primary_pollutants=["Untreated sewage from 18 major stormwater nullahs", "Microplastics", "Chemical effluents"],
            pollution_summary="Extreme BOD load depletes dissolved oxygen down to negligible levels near Okhla.",
            photos=[],
            is_demo_data=True,
        )

        wb_hussain = WaterBody(
            id="wb-4",
            name="Hussain Sagar Lake",
            local_name="Hussain Sagar",
            type="lake",
            city="Hyderabad",
            state="Telangana",
            basin="Krishna / Musi Sub-basin",
            latitude=17.4239,
            longitude=78.4738,
            location_geom=from_shape(Point(78.4738, 17.4239), srid=4326),
            description="Historic heart-shaped lake built in 1563 by Ibrahim Quli Qutb Shah across a tributary of the river Musi.",
            historical_context="Supplied irrigation and drinking water for the historic twin cities.",
            dissolved_oxygen_mg_l=3.9,
            ph=7.6,
            bod_mg_l=11.2,
            tds_mg_l=540.0,
            turbidity_ntu=22.0,
            official_source="Telangana State Pollution Control Board (TSPCB)",
            compliance_status="Moderate Concern",
            quality_last_updated="2026-08-30",
            pollution_severity="Moderate",
            primary_pollutants=["Industrial catchment runoff", "Algal blooms", "Eutrophication"],
            pollution_summary="Nutrient runoff creates periodic algal blooms.",
            photos=[],
            is_demo_data=True,
        )

        wb_chandlai = WaterBody(
            id="wb-5",
            name="Chandlai Lake",
            local_name="Chandlai Talab",
            type="pond",
            city="Jaipur",
            state="Rajasthan",
            basin="Dhund River Catchment",
            latitude=26.6853,
            longitude=75.8752,
            location_geom=from_shape(Point(75.8752, 26.6853), srid=4326),
            description="Vibrant rainfed wetland and avian sanctuary 30 km south of Jaipur. Vital groundwater recharge reservoir buffering regional borewells.",
            historical_context="Century-old earthen bund engineered by traditional water masters to capture seasonal flash runoff from Aravalli hillocks.",
            dissolved_oxygen_mg_l=6.2,
            ph=7.8,
            bod_mg_l=3.8,
            tds_mg_l=310.0,
            turbidity_ntu=9.0,
            official_source="Rajasthan State Pollution Control Board (RSPCB)",
            compliance_status="Satisfactory",
            quality_last_updated="2026-09-08",
            pollution_severity="Low",
            primary_pollutants=["Invasive Prosopis juliflora weed encroachment", "Localized siltation of inlet canals"],
            pollution_summary="Water quality remains clear; primary task is desilting tributary feeder channels.",
            photos=[],
            is_demo_data=True,
        )

        wb_pashan = WaterBody(
            id="wb-6",
            name="Pashan Lake",
            local_name="Pashan Talav",
            type="lake",
            city="Pune",
            state="Maharashtra",
            basin="Mula-Mutha Basin",
            latitude=18.5362,
            longitude=73.7844,
            location_geom=from_shape(Point(73.7844, 18.5362), srid=4326),
            description="Manmade water body built in the British era to provide water to Pashan and Khadki. Urbanization in catchment has caused silt deposition.",
            historical_context="Surrounded by basaltic hillocks; critical nesting stop for migratory waterfowl.",
            dissolved_oxygen_mg_l=4.1,
            ph=7.5,
            bod_mg_l=7.9,
            tds_mg_l=460.0,
            turbidity_ntu=18.0,
            official_source="Maharashtra Pollution Control Board (MPCB)",
            compliance_status="Moderate Concern",
            quality_last_updated="2026-09-14",
            pollution_severity="Moderate",
            primary_pollutants=["Domestic sewage inflows from Baner/Pashan", "Siltation from construction sites"],
            pollution_summary="High silt load reduces water storage depth. Citizen groups created bund barriers.",
            photos=[],
            is_demo_data=True,
        )

        db.add_all([wb_godavari, wb_bellandur, wb_yamuna, wb_hussain, wb_chandlai, wb_pashan])
        db.flush()

        # Add Observations
        obs1 = Observation(
            id="obs-1",
            water_body_id="wb-1",
            user_id="user-1",
            user_name="Maya Sharma",
            category="plastic-waste",
            note="Volunteers cleared 320 kg of entangled plastic from the stone ghat embankment. Native reeds show healthy regrowth.",
            is_citizen_report=True,
            observed_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )
        obs2 = Observation(
            id="obs-2",
            water_body_id="wb-2",
            user_id="user-2",
            user_name="Arjun Nambiar",
            category="foaming",
            note="Foaming barrier at weir outlet inspected. Floating vetiver bio-islands installed by citizen collective are thriving.",
            is_citizen_report=True,
            observed_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )
        db.add_all([obs1, obs2])

        # 2. AQUIFERS
        aq_deccan = Aquifer(
            id="aq-1",
            name="Deccan Traps Basaltic Aquifer System",
            hydrogeology_type="Basaltic (Deccan Traps)",
            region="Maharashtra, Western Madhya Pradesh & Northern Karnataka",
            latitude=19.7515,
            longitude=75.7139,
            location_geom=from_shape(Point(75.7139, 19.7515), srid=4326),
            cgwb_category="Semi-Critical",
            water_table_depth_bgl_meters=14.5,
            ten_year_trend="Declining",
            trend_rate_meters_per_year=0.35,
            recharge_potential="Moderate",
            soil_infiltration_rate_mm_hr=12.0,
            safe_recharge_practices=[
                "Shallow recharge pits (up to 3m depth) with graded sand-gravel filter beds",
                "Contour trenching on basalt hill slopes to slow runoff and encourage infiltration",
                "Desilting traditional farm ponds and check dams to expose weathered vesicular basalt zones"
            ],
            risks_and_warnings=[
                "DO NOT inject unfiltered urban surface runoff directly into deep borewells; fractures connect directly to drinking zones without soil filtration.",
                "Basalt has low specific yield (1% to 3%); water is stored in thin joint fractures and vesicular lava flows, depleting rapidly during summer heat."
            ],
            official_source="Central Ground Water Board (CGWB) Dynamic Ground Water Resources Assessment",
            description="Layered volcanic lava flows with weathered upper crust (murrum) and fractured columnar basalt. Water yield is highly localized along fracture joints.",
            is_demo_data=True,
        )

        aq_gangetic = Aquifer(
            id="aq-2",
            name="Indo-Gangetic Deep Alluvial Aquifer",
            hydrogeology_type="Alluvial (Gangetic)",
            region="Punjab, Haryana, Delhi NCR, and Uttar Pradesh Plains",
            latitude=28.7041,
            longitude=77.1025,
            location_geom=from_shape(Point(77.1025, 28.7041), srid=4326),
            cgwb_category="Over-exploited",
            water_table_depth_bgl_meters=38.2,
            ten_year_trend="Rapidly Depleting",
            trend_rate_meters_per_year=0.85,
            recharge_potential="High",
            soil_infiltration_rate_mm_hr=28.0,
            safe_recharge_practices=[
                "Floodplain preservation and pond rejuvenation to store surplus monsoon peak flows",
                "Rooftop rainwater harvesting with sediment settling tanks and recharge shafts into sandy horizons",
                "Community permeable pavements along park perimeters"
            ],
            risks_and_warnings=[
                "Over-extraction exceeds natural recharge by up to 140% in agricultural and urban belts.",
                "Risk of deep saline groundwater up-coning if freshwater unconfined layers are depleted past 50m."
            ],
            official_source="CGWB National Compilation on Dynamic Ground Water Resources of India",
            description="Immense multilayered sand, silt, and gravel sediment deposited by the Himalayan river system. Exceptionally high storage porosity.",
            is_demo_data=True,
        )

        aq_hardrock = Aquifer(
            id="aq-3",
            name="South Indian Crystalline Hard Rock Aquifer",
            hydrogeology_type="Hard Rock / Crystalline",
            region="Bengaluru Plateau, Mysore, Tamil Nadu Crystalline Belt",
            latitude=12.9716,
            longitude=77.5946,
            location_geom=from_shape(Point(77.5946, 12.9716), srid=4326),
            cgwb_category="Critical",
            water_table_depth_bgl_meters=52.0,
            ten_year_trend="Declining",
            trend_rate_meters_per_year=0.65,
            recharge_potential="Constrained by Impervious Surfaces",
            soil_infiltration_rate_mm_hr=8.0,
            safe_recharge_practices=[
                "Cascade tank desilting (re-establishing natural hydrological connectivity between lakes)",
                "Percolation wells placed in low-lying natural valleys with red loamy soil",
                "Swales and rain gardens along road reserves to intercept road runoff"
            ],
            risks_and_warnings=[
                "Extreme borewell depths (up to 1,000 feet) tapping ancient fossil fractures with elevated fluoride and nitrates.",
                "Urban impervious surfaces exceed 85% in city cores, preventing rainwater from reaching the saprolite weathered zone."
            ],
            official_source="CGWB Regional Office Bengaluru / WRIS Ground Water Atlas",
            description="Composed of granite and gneiss basement rocks. Groundwater exists only in shallow weathered overburden and deeper shear fractures.",
            is_demo_data=True,
        )

        aq_sandstone = Aquifer(
            id="aq-4",
            name="Western Arid Sandstone & Quaternary Aquifer",
            hydrogeology_type="Coastal Sandstone",
            region="Jaipur, Jodhpur, Bikaner, and Shekhawati Belt (Rajasthan)",
            latitude=26.9124,
            longitude=75.7873,
            location_geom=from_shape(Point(75.7873, 26.9124), srid=4326),
            cgwb_category="Over-exploited",
            water_table_depth_bgl_meters=64.0,
            ten_year_trend="Declining",
            trend_rate_meters_per_year=0.9,
            recharge_potential="Low",
            soil_infiltration_rate_mm_hr=45.0,
            safe_recharge_practices=[
                "Revival of traditional Baolis (stepwells), Kunds, and Tankas for decentralized storage",
                "Catchment contour bunding to maximize retention of short episodic desert monsoon showers",
                "Channeling rooftop runoff into clean household storage tankas before groundwater recharge"
            ],
            risks_and_warnings=[
                "Low annual rainfall (300-500 mm) makes replenishment extremely slow.",
                "High potential evaporation (exceeding 2,000 mm/year) means open water loses rapidly to heat."
            ],
            official_source="Ground Water Department Rajasthan / CGWB Western Region",
            description="Thick aeolian sand dunes overlying hard sandstone. Sandy soils have high permeability, but low seasonal rainfall requires specialized water architectures.",
            is_demo_data=True,
        )

        db.add_all([aq_deccan, aq_gangetic, aq_hardrock, aq_sandstone])

        # 3. HEAT ZONES
        hz_nagpur = HeatZone(
            id="hz-1",
            city="Nagpur & Vidarbha Corridor",
            area_name="Central Commercial & Industrial Belt",
            latitude=21.1458,
            longitude=79.0882,
            location_geom=from_shape(Point(79.0882, 21.1458), srid=4326),
            current_temp_c=43.6,
            feels_like_c=46.2,
            wet_bulb_temp_c=28.5,
            relative_humidity_percent=24.0,
            risk_level="Severe Heatwave",
            imd_alert="Orange",
            urban_canopy_percent=11.0,
            impervious_surface_percent=82.0,
            water_stress_multiplier="2.5x Critical Surge",
            peak_hours="11:30 AM – 4:30 PM",
            community_cooling_tips=[
                "Erect shaded khus (vetiver grass) mats wetted with recycled water outside public shops",
                "Setup community earthen pot (matka) drinking water stations along public walkways",
                "Keep rooftops painted with solar-reflective white lime wash to reduce indoor radiant heat by 4-6°C"
            ],
            nearby_cooling_centres=[
                {"name": "Dharampeth Community Library Hall", "distance": "0.8 km"},
                {"name": "Sitabuldi Shaded Transit Shelter", "distance": "1.4 km"}
            ],
            official_source="India Meteorological Department (IMD) Heat Action Bulletin / NDMA",
            is_demo_data=True,
        )

        hz_delhi = HeatZone(
            id="hz-2",
            city="Delhi NCR",
            area_name="Old Delhi & Trans-Yamuna Dense Corridors",
            latitude=28.6505,
            longitude=77.2303,
            location_geom=from_shape(Point(77.2303, 28.6505), srid=4326),
            current_temp_c=41.8,
            feels_like_c=47.5,
            wet_bulb_temp_c=30.2,
            relative_humidity_percent=44.0,
            risk_level="Severe Heatwave",
            imd_alert="Orange",
            urban_canopy_percent=7.0,
            impervious_surface_percent=91.0,
            water_stress_multiplier="2.5x Critical Surge",
            peak_hours="12:00 PM – 5:00 PM",
            community_cooling_tips=[
                "High humidity paired with high temperature raises wet-bulb temperature near physiological stress limits",
                "Prioritize elderly and outdoor gig workers with shaded hydration hubs",
                "Plant native shade trees (Neem, Peepal, Jamun) along western-facing street corridors"
            ],
            nearby_cooling_centres=[
                {"name": "Chandni Chowk Municipal Cooling Pavilion", "distance": "0.5 km"},
                {"name": "Red Fort Metro Underground Air-Cooled Foyer", "distance": "0.9 km"}
            ],
            official_source="Delhi Disaster Management Authority (DDMA) / IMD",
            is_demo_data=True,
        )

        hz_bengaluru = HeatZone(
            id="hz-3",
            city="Bengaluru",
            area_name="Whitefield & Outer Ring Road Tech Corridor",
            latitude=12.9856,
            longitude=77.7315,
            location_geom=from_shape(Point(77.7315, 12.9856), srid=4326),
            current_temp_c=36.4,
            feels_like_c=38.0,
            wet_bulb_temp_c=25.1,
            relative_humidity_percent=36.0,
            risk_level="Moderate",
            imd_alert="Yellow",
            urban_canopy_percent=14.0,
            impervious_surface_percent=79.0,
            water_stress_multiplier="1.8x Heavy Stress",
            peak_hours="12:30 PM – 3:30 PM",
            community_cooling_tips=[
                "Rapid concretization has created micro-urban heat pockets 3.5°C warmer than Lalbagh parklands",
                "Preserve and expand roadside bioswales and tree cover to curb asphalt heat release"
            ],
            nearby_cooling_centres=[
                {"name": "Kadugodi Community Health Centre", "distance": "1.2 km"}
            ],
            official_source="Karnataka State Disaster Management Authority / IMD Bengaluru",
            is_demo_data=True,
        )

        hz_ahmedabad = HeatZone(
            id="hz-4",
            city="Ahmedabad",
            area_name="Vatva & Naroda Industrial Cluster",
            latitude=22.9868,
            longitude=72.6377,
            location_geom=from_shape(Point(72.6377, 22.9868), srid=4326),
            current_temp_c=42.5,
            feels_like_c=44.8,
            wet_bulb_temp_c=27.8,
            relative_humidity_percent=28.0,
            risk_level="High",
            imd_alert="Orange",
            urban_canopy_percent=8.0,
            impervious_surface_percent=88.0,
            water_stress_multiplier="1.8x Heavy Stress",
            peak_hours="11:00 AM – 4:30 PM",
            community_cooling_tips=[
                "Pioneer of South Asia's first Heat Action Plan (HAP)",
                "Community cool-roof coatings applied by neighborhood youth keep slum dwellings significantly cooler",
                "Drinking water kiosks (parabs) maintained by citizen trusts at transport intersections"
            ],
            nearby_cooling_centres=[
                {"name": "Vatva Urban Health Centre Shaded Wing", "distance": "0.6 km"}
            ],
            official_source="Ahmedabad Municipal Corporation Heat Action Plan / IMD",
            is_demo_data=True,
        )

        db.add_all([hz_nagpur, hz_delhi, hz_bengaluru, hz_ahmedabad])

        # 4. COMMUNITIES
        comm1 = Community(
            id="comm-1",
            name="Jal-Sangam Maharashtra",
            tagline="Grassroots water warriors & stepwell revival collective",
            description="A coalition of citizen ecologists, college volunteers, and neighborhood associations in Nashik, Pune, and Ahmednagar restoring traditional stepwells, monitoring river outfalls, and constructing decentralized percolation pits.",
            focus_areas=["water-body", "groundwater", "rainwater-harvesting", "pollution-cleanup"],
            city="Pune",
            state="Maharashtra",
            latitude=18.5204,
            longitude=73.8567,
            location_geom=from_shape(Point(73.8567, 18.5204), srid=4326),
            water_body_id="wb-1",
            created_by_user_id="user-1",
            photos=[],
            announcements=[
                {
                    "id": "ann-1",
                    "title": "Upcoming Pre-Monsoon Percolation Pit Audit",
                    "content": "Join our team this Saturday as we inspect 15 neighborhood recharge pits in Kothrud.",
                    "date": "2026-09-26"
                }
            ],
            is_demo_data=True,
        )

        comm2 = Community(
            id="comm-2",
            name="Bengaluru Lake Guardians",
            tagline="Protecting lake cascades & reviving urban recharge",
            description="Citizen group committed to restoring East Bengaluru lake cascades. We organize weekly water quality sampling, foam barrier checks, and floating wetland maintenance.",
            focus_areas=["water-body", "pollution-cleanup", "groundwater"],
            city="Bengaluru",
            state="Karnataka",
            latitude=12.9716,
            longitude=77.5946,
            location_geom=from_shape(Point(77.5946, 12.9716), srid=4326),
            water_body_id="wb-2",
            created_by_user_id="user-2",
            photos=[],
            announcements=[
                {
                    "id": "ann-2",
                    "title": "Water Hyacinth Removal Drive at Bellandur Inlet",
                    "content": "Protective gloves and rakes provided. Let us clear the blockage before the weekend runoff.",
                    "date": "2026-09-28"
                }
            ],
            is_demo_data=True,
        )

        comm3 = Community(
            id="comm-3",
            name="Yamuna Floodplain Stewards",
            tagline="Defending Delhi's riverbed sponge and heat shelters",
            description="Youth-led environmental defense and community action network mapping debris outflows and organizing community shade kiosks during heatwaves.",
            focus_areas=["water-body", "heat-resilience", "pollution-cleanup", "groundwater"],
            city="Delhi NCR",
            state="Delhi",
            latitude=28.6139,
            longitude=77.2090,
            location_geom=from_shape(Point(77.2090, 28.6139), srid=4326),
            water_body_id="wb-3",
            created_by_user_id="user-3",
            photos=[],
            announcements=[],
            is_demo_data=True,
        )

        db.add_all([comm1, comm2, comm3])
        db.flush()

        # Community Members & Posts
        cm1 = CommunityMember(
            id="cm-1",
            community_id="comm-1",
            user_id="user-1",
            user_name="Maya Sharma",
            role="admin",
            joined_at=datetime.now(timezone.utc),
        )
        cm2 = CommunityMember(
            id="cm-2",
            community_id="comm-1",
            user_id="user-2",
            user_name="Arjun Nambiar",
            role="volunteer",
            joined_at=datetime.now(timezone.utc),
        )
        db.add_all([cm1, cm2])

        cp1 = CommunityPost(
            id="post-1",
            community_id="comm-1",
            user_id="user-1",
            user_name="Maya Sharma",
            content="Great milestone! The desilted stepwell at Trimbakeshwar has retained 1.8 meters of clean spring water through peak summer heat. Neighboring open wells report a 1.2m rise in water table!",
            likes_count=38,
            created_at=datetime.now(timezone.utc),
        )
        db.add(cp1)
        db.flush()

        cmt1 = Comment(
            id="cmt-1",
            post_id="post-1",
            user_id="user-2",
            user_name="Arjun Nambiar",
            text="Incredible work team. Documenting this impact helps convince neighboring municipal wards to do the same!",
            created_at=datetime.now(timezone.utc),
        )
        db.add(cmt1)

        # 5. ACTIVITIES & IMPACT
        act1 = Activity(
            id="act-1",
            community_id="comm-1",
            water_body_id="wb-1",
            title="Godavari Riverbank Cleanup & Riparian Planting",
            description="Join our collective along Ramkund ghat stretch to clear entangled plastic waste and plant deep-rooting vetiver grass that stabilizes soil and phytoremediates urban greywater runoff.",
            category="cleanup",
            location_name="Ramkund Ghat, Godavari Riverbank",
            location_address="Panchavati, Nashik, Maharashtra 422003",
            latitude=19.9975,
            longitude=73.7898,
            location_geom=from_shape(Point(73.7898, 19.9975), srid=4326),
            date="2026-10-18",
            time="07:30 AM – 10:30 AM IST",
            organizer_id="user-1",
            organizer_name="Maya Sharma",
            volunteer_limit=40,
            status="upcoming",
            photos=[],
            is_demo_data=True,
        )

        act2 = Activity(
            id="act-2",
            community_id="comm-3",
            water_body_id="wb-3",
            title="Heatwave Hydration & Floodplain Sponge Walk",
            description="Community walk educating residents on why unpaved river easements absorb summer thermal heat, while setting up two shaded clay pot drinking water kiosks for daily wage laborers.",
            category="heat-shelter",
            location_name="Yamuna Bio-Diversity Park Gate 2",
            location_address="Jagatpur, Wazirabad, Delhi 110084",
            latitude=28.7230,
            longitude=77.2180,
            location_geom=from_shape(Point(77.2180, 28.7230), srid=4326),
            date="2026-10-20",
            time="09:00 AM – 12:00 PM IST",
            organizer_id="user-3",
            organizer_name="Priya Verma",
            volunteer_limit=25,
            status="upcoming",
            photos=[],
            is_demo_data=True,
        )

        act3 = Activity(
            id="act-3",
            community_id="comm-1",
            water_body_id="wb-6",
            title="Historic Baoli Stepwell Desilting & Revival",
            description="Mobilized 80 community volunteers to clear 60 years of accumulated plastic and urban debris from a 17th-century stepped tank in Kothrud, reconnecting it to natural hillside recharge channels.",
            category="rwh-maintenance",
            location_name="Panchaleshwar Stepwell Complex",
            location_address="Kothrud, Pune, Maharashtra 411038",
            latitude=18.5074,
            longitude=73.8077,
            location_geom=from_shape(Point(73.8077, 18.5074), srid=4326),
            date="2026-09-12",
            time="07:00 AM – 01:00 PM IST",
            organizer_id="user-1",
            organizer_name="Maya Sharma",
            volunteer_limit=80,
            status="completed",
            photos=[],
            is_demo_data=True,
        )

        db.add_all([act1, act2, act3])
        db.flush()

        # Activity Participation
        ap1 = ActivityParticipation(
            id="ap-1",
            activity_id="act-1",
            user_id="user-1",
            user_name="Maya Sharma",
            joined_at=datetime.now(timezone.utc),
        )
        ap2 = ActivityParticipation(
            id="ap-2",
            activity_id="act-1",
            user_id="user-2",
            user_name="Arjun Nambiar",
            joined_at=datetime.now(timezone.utc),
        )
        db.add_all([ap1, ap2])

        # Activity Impact
        ai1 = ActivityImpact(
            id="ai-1",
            activity_id="act-3",
            before_photo="https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80",
            after_photo="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
            description="Before: Choked with solid waste and broken culverts. After: 4,200 kg debris removed, stone floor revealed, 1.8m natural spring water restored, creating a cool microclimate oasis.",
            impact_summary="4,200 kg debris removed · 80 volunteers · Recharged 6 local borewells",
            volunteers_attended=80,
            waste_removed_kg=4200.0,
            structures_maintained=1,
            created_at=datetime.now(timezone.utc),
        )
        db.add(ai1)

        # 6. ENVIRONMENTAL REPORTS
        rep1 = EnvironmentalReport(
            id="rep-1",
            title="Untreated Commercial Greywater Inflow into Godavari Riverbank",
            category="sewage-inflow",
            description="Observed a newly breached drainage pipe discharging dark grey effluent directly into the riverbed near Panchavati bridge, accompanied by high sulfur odor.",
            status="VERIFIED",
            status_note="Ground team confirmed active discharge. Reported to local ward environmental officer for interceptor diversion.",
            location_name="Panchavati Riverbank Outfall",
            city="Nashik",
            state="Maharashtra",
            latitude=19.9982,
            longitude=73.7915,
            location_geom=from_shape(Point(73.7915, 19.9982), srid=4326),
            water_body_id="wb-1",
            submitted_by_user_id="user-1",
            submitted_by_user_name="Maya Sharma",
            is_citizen_report=True,
            is_demo_data=True,
            submitted_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )

        rep2 = EnvironmentalReport(
            id="rep-2",
            title="Surfactant Foaming Accumulation at Bellandur Lake Outlet",
            category="foaming",
            description="Following afternoon thunderstorm, high surfactant foam reached 1.5 meters height near eastern spillway. Wind blowing foam across commuter roadway.",
            status="UNDER_REVIEW",
            status_note="Field volunteers inspecting sprinkler suppression system.",
            location_name="Bellandur Eastern Spillway",
            city="Bengaluru",
            state="Karnataka",
            latitude=12.9378,
            longitude=77.6745,
            location_geom=from_shape(Point(77.6745, 12.9378), srid=4326),
            water_body_id="wb-2",
            submitted_by_user_id="user-2",
            submitted_by_user_name="Arjun Nambiar",
            is_citizen_report=True,
            is_demo_data=True,
            submitted_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )

        rep3 = EnvironmentalReport(
            id="rep-3",
            title="Illegal Construction Silt Dumping along Yamuna Floodplain Easement",
            category="garbage-dumping",
            description="Trucks dumping dense construction and demolition debris on permeable floodplain sands near Mayur Vihar, paving over critical natural aquifer recharge surface.",
            status="SUBMITTED",
            status_note="Citizen observation pending community site check.",
            location_name="Mayur Vihar Floodplain Buffer",
            city="Delhi NCR",
            state="Delhi",
            latitude=28.6010,
            longitude=77.2950,
            location_geom=from_shape(Point(77.2950, 28.6010), srid=4326),
            water_body_id="wb-3",
            submitted_by_user_id="user-3",
            submitted_by_user_name="Priya Verma",
            is_citizen_report=True,
            is_demo_data=True,
            submitted_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )

        db.add_all([rep1, rep2, rep3])

        db.commit()
        print("[Jal-Dharani Seeder]: Successfully seeded all development/demo environmental data into PostGIS!")

    except Exception as e:
        db.rollback()
        print(f"[Jal-Dharani Seeder Error]: {e}")
        raise e
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
