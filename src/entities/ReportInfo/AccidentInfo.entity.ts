// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
// export class AccidentInfo {
//   @PrimaryGeneratedColumn('uuid')
//   id: number;

//   // Tổng số vụ tai nạn lao động
//   @Column()
//   totalAccidents: number;
// // Số người chết vì TNLD
//   @Column()
//   deaths: number;
// // Số vụ có người chết
//   @Column()
//   numberOfFatalIncidents: number;
// // Tổng chi phí cho TNLD
//   @Column()
//   totalCost: number;
// // Số người bị TNLD
//   @Column()
//   totalInjured: number;
// // Số ngày công vì TNLD
//   @Column()
//   lostWorkDays: number;

//   @ManyToOne(() => Report, (report) => report.accidentInfos)
//   report: Report;
// }
