INSERT_WARD = """
insert into wards (ward_id, ward_name, geom)
values (%s, %s, ST_GeomFromText(%s))
"""
get_wards = "select ward_id, ward_name from wards"

count_wards = "select count(*) from wards"