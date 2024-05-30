import { MigrationInterface, QueryRunner } from "typeorm";

export class distanceFunction1684072653555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION distance(
        lat1 double precision,
        lon1 double precision,
        lat2 double precision,
        lon2 double precision)
      RETURNS double precision AS
    $BODY$
    DECLARE
        R integer = 6371e3; -- Meters
        rad double precision = 0.01745329252;
    
        var1 double precision = lat1 * rad;
        var2 double precision = lat2 * rad;
        var3 double precision = (lat2-lat1) * rad;
        var4 double precision = (lon2-lon1) * rad;
    
        a double precision = sin(var3/2) * sin(var3/2) + cos(var1) * cos(var2) * sin(var4/2) * sin(var4/2);
        c double precision = 2 * atan2(sqrt(a), sqrt(1-a));    
    BEGIN                                                     
        RETURN R * c;        
    END  
    $BODY$
      LANGUAGE plpgsql VOLATILE
      COST 100;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION distance(double precision,double precision,double precision,double precision);`
    ); // reverts things made in "up" method
  }
}
