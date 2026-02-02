
import { useState, useMemo, useEffect } from "react";

function useWindowSize() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ═══════════════════════════════════════════════════════════
   DATA — all 103 processes from Processes-040605-1.xlsx + new ones for Support & OrgExcellency
   ═══════════════════════════════════════════════════════════ */

const PROCESSES = [
  { tag:"PPRF", group:"Plan & Align Production", en:"Reservoir Forecasting & Analysis", fa:"پیش‑بینی تولید و تحلیل مخزن", dept:"ProductionEngineering" },
  { tag:"PPDP", group:"Plan & Align Production", en:"Development of Production Plan", fa:"تدوین برنامه تولید", dept:"ProductionEngineering" },
  { tag:"PPEO", group:"Plan & Align Production", en:"Extraction Optimization Planning", fa:"برنامه‑ریزی بهینه‑سازی برداشت", dept:"ProductionEngineering" },
  { tag:"PPOC", group:"Plan & Align Production", en:"Managing Operational Constraints", fa:"مدیریت محدودیت‌های عملیاتی", dept:"ProductionEngineering" },
  { tag:"PPCP", group:"Plan & Align Production", en:"Coordination with Processing & Market", fa:"هماهنگی با واحدهای فرآورش و بازار", dept:"ProductionEngineering" },
  { tag:"PPRM", group:"Plan & Align Production", en:"Production Risk Management", fa:"مدیریت ریسک‌های تولید", dept:"ProductionEngineering" },
  { tag:"PPGR", group:"Plan & Align Production", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری برنامه‌های تولید", dept:"ProductionEngineering" },
  { tag:"PPDT", group:"Plan & Align Production", en:"Digital Technologies for Planning", fa:"پیاده‑سازی فناوری‌های دیجیتال", dept:"ProductionEngineering" },
  { tag:"EPMO", group:"Execute Production", en:"Well Monitoring & Control", fa:"پایش و کنترل چاه‌ها", dept:"Operations" },
  { tag:"EPWM", group:"Execute Production", en:"Wellhead Equipment Management", fa:"مدیریت تجهیزات سرچاهی", dept:"Operations" },
  { tag:"EPSO", group:"Execute Production", en:"Initial Separation Operation", fa:"عملیات جداسازی اولیه", dept:"Operations" },
  { tag:"EPWI", group:"Execute Production", en:"Production Optimization Methods", fa:"اجرای روش‌های بهینه‑سازی تولید", dept:"Operations" },
  { tag:"EPWW", group:"Execute Production", en:"Wastewater & Waste Management", fa:"مدیریت پساب‌ها و مواد زائد", dept:"Operations" },
  { tag:"EPGR", group:"Execute Production", en:"Recording & Reporting Production Data", fa:"ثبت و گزارش‌گیری داده‌های تولید", dept:"Operations" },
  { tag:"EPOR", group:"Execute Production", en:"Managing Outages & Restarts", fa:"مدیریت توقفات و راه‑اندازی مجدد", dept:"Operations" },
  { tag:"MAMO", group:"Manage Production Assets", en:"Equipment Performance Monitoring", fa:"نظارت و پایش عملکرد تجهیزات", dept:"Maintenance" },
  { tag:"MAPM", group:"Manage Production Assets", en:"Preventive Maintenance", fa:"نگهداری پیشگیرانه", dept:"Maintenance" },
  { tag:"MAAI", group:"Manage Production Assets", en:"Asset Integrity Management", fa:"مدیریت یکپارچگی دارایی‌ها", dept:"Maintenance" },
  { tag:"MACM", group:"Manage Production Assets", en:"Corrective Maintenance", fa:"تعمیرات اصلاحی", dept:"Maintenance" },
  { tag:"MASI", group:"Manage Production Assets", en:"Spare Parts Inventory Mgmt", fa:"مدیریت موجودی قطعات یدکی", dept:"Maintenance" },
  { tag:"MAFO", group:"Manage Production Assets", en:"Facility Performance Optimization", fa:"بهینه‑سازی عملکرد تأسیسات", dept:"Maintenance" },
  { tag:"MAES", group:"Manage Production Assets", en:"Equipment & Facility Safety Mgmt", fa:"مدیریت ایمنی تجهیزات و تأسیسات", dept:"Maintenance" },
  { tag:"MAGR", group:"Manage Production Assets", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری", dept:"Maintenance" },
  { tag:"OPCD", group:"Monitor & Optimize", en:"Collecting & Analyzing Production Data", fa:"جمع‑آوری و تحلیل داده‌های تولید", dept:"ProductionEngineering" },
  { tag:"OPMO", group:"Monitor & Optimize", en:"Well Performance Monitoring", fa:"پایش عملکرد چاه‌ها", dept:"ProductionEngineering" },
  { tag:"OPWO", group:"Monitor & Optimize", en:"Well Operation Optimization", fa:"بهینه‑سازی عملیات چاه", dept:"ProductionEngineering" },
  { tag:"OPRM", group:"Monitor & Optimize", en:"Reservoir Analysis & Modeling", fa:"تحلیل و مدل‑سازی مخزن", dept:"ProductionEngineering" },
  { tag:"OPPB", group:"Monitor & Optimize", en:"Managing Production Bottlenecks", fa:"مدیریت گلوگاه‌های تولید", dept:"ProductionEngineering" },
  { tag:"OPRO", group:"Monitor & Optimize", en:"Energy & Resource Optimization", fa:"بهینه‑سازی مصرف انرژی و منابع", dept:"ProductionEngineering" },
  { tag:"OPGR", group:"Monitor & Optimize", en:"Performance Reports & Forecasts", fa:"تهیه گزارش‌های عملکرد و پیش‑بینی", dept:"ProductionEngineering" },
  { tag:"OPDT", group:"Monitor & Optimize", en:"Digital Technologies for Optimization", fa:"فناوری‌های دیجیتال برای بهینه‑سازی", dept:"ProductionEngineering" },
  { tag:"WWPO", group:"Well Workover with Rig", en:"Planning Well Repair Operations", fa:"برنامه‑ریزی و طراحی عملیات تعمیر چاه", dept:"Operations" },
  { tag:"WWCW", group:"Well Workover with Rig", en:"Rig & Equipment Coordination", fa:"آماده‑سازی و هماهنگی تجهیزات و دکل", dept:"Operations" },
  { tag:"WWRM", group:"Well Workover with Rig", en:"Rig Transfer & Installation", fa:"انتقال و نصب دکل در محل چاه", dept:"Operations" },
  { tag:"WWWE", group:"Well Workover with Rig", en:"Carrying Out Well Repair", fa:"اجرای عملیات تعمیر چاه", dept:"Operations" },
  { tag:"WWMO", group:"Well Workover with Rig", en:"Repair Operations Monitoring", fa:"پایش و کنترل عملیات تعمیر", dept:"Operations" },
  { tag:"WWWT", group:"Well Workover with Rig", en:"Well Testing & Restarting", fa:"آزمایش و راه‑اندازی مجدد چاه", dept:"Operations" },
  { tag:"WWSM", group:"Well Workover with Rig", en:"Safety & Environmental Mgmt", fa:"مدیریت ایمنی و زیست‑محیطی", dept:"Operations" },
  { tag:"WWGR", group:"Well Workover with Rig", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری عملیات", dept:"Operations" },
  { tag:"PLPT", group:"Plan Logistics & Delivery", en:"Crude Oil Transportation Plan", fa:"تدوین برنامه انتقال نفت خام", dept:"Planning" },
  { tag:"PLCM", group:"Plan Logistics & Delivery", en:"Pipeline Capacity Management", fa:"مدیریت ظرفیت خطوط لوله و تأسیسات", dept:"Planning" },
  { tag:"PLMO", group:"Plan Logistics & Delivery", en:"Logistics Needs Forecasting", fa:"پایش و پیش‑بینی نیازهای لجستیکی", dept:"Planning" },
  { tag:"PLMS", group:"Plan Logistics & Delivery", en:"Contractor & Supplier Coordination", fa:"مدیریت هماهنگی با پیمانکاران", dept:"Planning" },
  { tag:"PLRM", group:"Plan Logistics & Delivery", en:"Logistics Risk Management", fa:"برنامه‑ریزی مدیریت ریسک لجستیکی", dept:"Planning" },
  { tag:"PLOT", group:"Plan Logistics & Delivery", en:"Route & Cost Optimization", fa:"بهینه‑سازی مسیرها و هزینه‌های انتقال", dept:"Planning" },
  { tag:"PLGR", group:"Plan Logistics & Delivery", en:"Logistics Plans Documentation", fa:"مستندسازی و گزارش‌گیری لجستیک", dept:"Planning" },
  { tag:"EDPT", group:"Execute Delivery", en:"Preparing Crude Oil for Transport", fa:"آماده‑سازی نفت خام برای انتقال", dept:"Operations" },
  { tag:"EDMT", group:"Execute Delivery", en:"Transmission Flow Monitoring", fa:"پایش و کنترل جریان انتقال", dept:"Operations" },
  { tag:"EDPO", group:"Execute Delivery", en:"Pipeline Operations Management", fa:"مدیریت عملیات خطوط لوله", dept:"Operations" },
  { tag:"EDTM", group:"Execute Delivery", en:"Temporary Storage Management", fa:"مدیریت ذخیره‑سازی موقت", dept:"Operations" },
  { tag:"EDST", group:"Execute Delivery", en:"Transport Safety & Environmental Mgmt", fa:"مدیریت ایمنی و زیست‑محیطی در انتقال", dept:"Operations" },
  { tag:"EDCP", group:"Execute Delivery", en:"Coordination with Processing Unit", fa:"هماهنگی با واحد فرآورش", dept:"Operations" },
  { tag:"EDDT", group:"Execute Delivery", en:"Transfer Operations Documentation", fa:"مستندسازی عملیات انتقال", dept:"Operations" },
  { tag:"EDTI", group:"Execute Delivery", en:"Troubleshooting & Incident Mgmt", fa:"رفع اشکالات و مدیریت خرابی‌ها", dept:"Operations" },
  { tag:"PQCS", group:"Manage Product Quality", en:"Crude Oil Quality Sampling", fa:"نمونه‑برداری و آنالیز کیفیت نفت خام", dept:"TechnicalInspection" },
  { tag:"PQMC", group:"Manage Product Quality", en:"Quality Parameter Monitoring", fa:"پایش و کنترل پارامترهای کیفی", dept:"TechnicalInspection" },
  { tag:"PQPI", group:"Manage Product Quality", en:"Primary Separation for Quality", fa:"مدیریت جداسازی اولیه برای بهبود کیفیت", dept:"TechnicalInspection" },
  { tag:"PQQT", group:"Manage Product Quality", en:"Quality Control in Transfer", fa:"کنترل کیفیت در فرآیند انتقال", dept:"TechnicalInspection" },
  { tag:"PQQR", group:"Manage Product Quality", en:"Quality Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری کیفیت", dept:"TechnicalInspection" },
  { tag:"PQDM", group:"Manage Product Quality", en:"Deviation & Corrective Actions", fa:"مدیریت انحرافات و اقدامات اصلاحی", dept:"TechnicalInspection" },
  { tag:"PQCR", group:"Manage Product Quality", en:"Standards & Regulatory Compliance", fa:"انطباق با استانداردها و الزامات نظارتی", dept:"TechnicalInspection" },
  { tag:"PQQP", group:"Manage Product Quality", en:"Digital Quality Optimization", fa:"بهینه‑سازی فرآیندهای کیفی با فناوری دیجیتال", dept:"TechnicalInspection" },
  { tag:"HSIM", group:"HSE", en:"Risk Identification & Mitigation", fa:"شناسایی و کاهش ریسک‌ها", dept:"HSE" },
  { tag:"HSEC", group:"HSE", en:"Environmental Compliance", fa:"اطمینان از انطباق زیست‑محیطی", dept:"HSE" },
  { tag:"HSEP", group:"HSE", en:"Production Operations Safety", fa:"اجرای عملیات تولید", dept:"HSE" },
  { tag:"HSMP", group:"HSE", en:"Production Asset Safety", fa:"مدیریت تجهیزات و تأسیسات سطحی", dept:"HSE" },
  { tag:"HSED", group:"HSE", en:"Delivery Safety", fa:"اجرای عملیات انتقال", dept:"HSE" },
  { tag:"HSMQ", group:"HSE", en:"Product Quality Safety", fa:"مدیریت کیفیت نفت خام", dept:"HSE" },
  { tag:"HSMI", group:"HSE", en:"Information Management", fa:"مدیریت اطلاعات", dept:"HSE" },
  { tag:"HSMA", group:"HSE", en:"Asset Maintenance Safety", fa:"نگهداری پیشگیرانه و تعمیرات تجهیزات", dept:"HSE" },
  { tag:"HRHC", group:"Human Capital Mgmt", en:"Human Capital Planning", fa:"برنامه‑ریزی سرمایه انسانی", dept:"HR" },
  { tag:"HRRS", group:"Human Capital Mgmt", en:"Recruitment & Selection", fa:"جذب و استخدام", dept:"HR" },
  { tag:"HRTD", group:"Human Capital Mgmt", en:"Training & Development", fa:"آموزش و توسعه", dept:"HR" },
  { tag:"HRPM", group:"Human Capital Mgmt", en:"Performance Management", fa:"ارزیابی عملکرد", dept:"HR" },
  { tag:"HRCB", group:"Human Capital Mgmt", en:"Compensation & Benefits", fa:"مدیریت حقوق و دستمزد", dept:"HR" },
  { tag:"HRER", group:"Human Capital Mgmt", en:"Employee Relations", fa:"روابط کارکنان", dept:"HR" },
  { tag:"HRWH", group:"Human Capital Mgmt", en:"Wellness, Health & Family", fa:"رفاه، سلامت و خانواده", dept:"HR" },
  { tag:"HRDI", group:"Human Capital Mgmt", en:"Diversity, Equity & Inclusion", fa:"مدیریت تنوع و گوناگونی", dept:"HR" },
  { tag:"HRST", group:"Human Capital Mgmt", en:"Separation & Termination", fa:"مدیریت خروج و جدایی", dept:"HR" },
  /* ── Supply Chain — now its own department ── */
  { tag:"SCSP", group:"Supply Chain Mgmt", en:"Supply Chain Planning", fa:"برنامه‑ریزی زنجیره تأمین", dept:"SupplyChain" },
  { tag:"SCSM", group:"Supply Chain Mgmt", en:"Source Management", fa:"انتخاب و مدیریت تأمین‑کنندگان", dept:"SupplyChain" },
  { tag:"SCPC", group:"Supply Chain Mgmt", en:"Procurement", fa:"خرید کالا و خدمات", dept:"SupplyChain" },
  { tag:"SCLT", group:"Supply Chain Mgmt", en:"Logistics & Transportation", fa:"مدیریت لجستیک و حمل‑ونقل", dept:"SupplyChain" },
  { tag:"SCST", group:"Supply Chain Mgmt", en:"Service Management", fa:"مدیریت خدمات پس از تحویل", dept:"SupplyChain" },
  { tag:"SCIM", group:"Supply Chain Mgmt", en:"Internal Customer Relationship", fa:"مدیریت روابط با مشتری داخلی", dept:"SupplyChain" },
  { tag:"SCSI", group:"Supply Chain Mgmt", en:"Chain Improvement & Innovation", fa:"بهبود و نوآوری در زنجیره تأمین", dept:"SupplyChain" },
  /* ── Organization Excellency — now its own department ── */
  { tag:"OEQA", group:"Organization Excellency", en:"Quality Assurance", fa:"تضمین کیفیت", dept:"OrgExcellency" },
  { tag:"OECI", group:"Organization Excellency", en:"Continuous Improvement", fa:"بهبود مستمر", dept:"OrgExcellency" },
  { tag:"OEBM", group:"Organization Excellency", en:"Benchmarking & Best Practices", fa:"بنچ مارکینگ و بهترین شیوه ها", dept:"OrgExcellency" },
  { tag:"OEAR", group:"Organization Excellency", en:"Audit & Review", fa:"ممیزی و بازنگری", dept:"OrgExcellency" },
  { tag:"OELD", group:"Organization Excellency", en:"Leadership Development", fa:"توسعه رهبری", dept:"OrgExcellency" },
  { tag:"OEKM", group:"Organization Excellency", en:"Knowledge Management", fa:"مدیریت دانش", dept:"OrgExcellency" },
  { tag:"OECR", group:"Organization Excellency", en:"Certification & Recognition", fa:"گواهینامه و شناخت", dept:"OrgExcellency" },
  { tag:"OEGR", group:"Organization Excellency", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری", dept:"OrgExcellency" },
  /* ── Technical Inspection ── */
  { tag:"TITP", group:"Technical Inspection", en:"Inspection Planning", fa:"برنامه ریزی بازرسی فنی", dept:"TechnicalInspection" },
  { tag:"TIVI", group:"Technical Inspection", en:"Visual & External Inspection", fa:"بازرسی خارجی و چشمی", dept:"TechnicalInspection" },
  { tag:"TIND", group:"Technical Inspection", en:"Non-Destructive Testing", fa:"بازرسی غیر مخرب", dept:"TechnicalInspection" },
  { tag:"TIPL", group:"Technical Inspection", en:"Pipeline Integrity Inspection", fa:"بازرسی یکپارچگی خطوط لوله", dept:"TechnicalInspection" },
  { tag:"TIPV", group:"Technical Inspection", en:"Pressure Vessel & Tank Inspection", fa:"بازرسی مخازن تحت فشار و ذخیره", dept:"TechnicalInspection" },
  { tag:"TIWC", group:"Technical Inspection", en:"Wellhead Equipment Inspection", fa:"بازرسی و کنترل تجهیزات سرچاهی", dept:"TechnicalInspection" },
  { tag:"TIGR", group:"Technical Inspection", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری", dept:"TechnicalInspection" },
  { tag:"TIRA", group:"Technical Inspection", en:"Root Cause Analysis", fa:"تحلیل ریشه‑ای علل عیوب", dept:"TechnicalInspection" },
  { tag:"TIAD", group:"Technical Inspection", en:"Asset Integrity DB Update", fa:"به‑روزرسانی پایگاه داده یکپارچگی دارایی‌ها", dept:"TechnicalInspection" },
  { tag:"TIIA", group:"Technical Inspection", en:"Inspection Program Audit & Review", fa:"ممیزی و بازنگری برنامه بازرسی", dept:"TechnicalInspection" },
  /* ── NEW: Support Processes ── */
  { tag:"SUGS", group:"General Support", en:"General Support Services", fa:"خدمات پشتیبانی عمومی", dept:"Support" },
  { tag:"SUHD", group:"General Support", en:"Helpdesk Management", fa:"مدیریت هلپ دسک", dept:"Support" },
  { tag:"SUAD", group:"General Support", en:"Administrative Support", fa:"پشتیبانی اداری", dept:"Support" },
  { tag:"SULG", group:"General Support", en:"Logistics Coordination", fa:"هماهنگی لجستیک", dept:"Support" },
  { tag:"SUFN", group:"General Support", en:"Facilities Management", fa:"مدیریت تسهیلات", dept:"Support" },
  { tag:"SUSR", group:"General Support", en:"Supplier Relations", fa:"روابط با تامین کنندگان", dept:"Support" },
  { tag:"SUGR", group:"General Support", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری", dept:"Support" },
  { tag:"SUDT", group:"General Support", en:"Digital Tools for Support", fa:"ابزارهای دیجیتال برای پشتیبانی", dept:"Support" },
];

/* 13 departments — added SupplyChain 🚛 & OrgExcellency 🏆 */
const DEPTS = [
  { id:"ProductionEngineering", fa:"مهندسی تولید",       icon:"⛽", color:"#e74c3c" },
  { id:"Operations",           fa:"بهره‑برداری",         icon:"🔧", color:"#2980b9" },
  { id:"TechnicalInspection",  fa:"بازرسی فنی",         icon:"🔍", color:"#e67e22" },
  { id:"Maintenance",          fa:"تعمیرات و نگهداری",  icon:"🛠️", color:"#27ae60" },
  { id:"Planning",             fa:"برنامه‑ریزی",        icon:"📅", color:"#8e44ad" },
  { id:"HSE",                  fa:"HSE",                 icon:"⚠️", color:"#f39c12" },
  { id:"HR",                   fa:"منابع انسانی",       icon:"👥", color:"#1abc9c" },
  { id:"Finance",              fa:"مالی",               icon:"💰", color:"#2ecc71" },
  { id:"SupplyChain",          fa:"زنجیره تأمین",       icon:"🚛", color:"#e91e63" },
  { id:"OrgExcellency",        fa:"تعالی سازمانی",      icon:"🏆", color:"#ff9800" },
  { id:"Warehouse",            fa:"انبار",              icon:"🏭", color:"#d35400" },
  { id:"IT",                   fa:"فناوری اطلاعات",     icon:"💻", color:"#9b59b6" },
  { id:"Support",              fa:"پشتیبانی",           icon:"🤝", color:"#3498db" },
];

const DEPT_FOLDERS = {
  ProductionEngineering: [
    { name:"Procedures", icon:"📝", sub:["PPRF_Reservoir_Forecasting","PPDP_Production_Plan","PPEO_Extraction_Optimization","PPOC_Operational_Constraints","PPCP_Coordination_Processing","PPRM_Production_Risk_Mgmt","PPGR_Documentation_Reporting","PPDT_Digital_Technologies","OPCD_Data_Collection","OPMO_Well_Performance","OPWO_Well_Operation_Opt","OPRM_Reservoir_Analysis","OPPB_Production_Bottlenecks","OPRO_Energy_Optimization","OPGR_Performance_Reports","OPDT_Digital_Optimization"]},
    { name:"Reports", icon:"📊", sub:["Monthly","Weekly","Well_Performance","Reservoir_Status","Optimization_Results"]},
    { name:"Records", icon:"🗃️", sub:["Daily_Production_Data","Sensor_Logs","Well_Charts","Forecasts_History"]},
    { name:"Projects", icon:"📁", sub:["_Template → Planning | Execution | Monitoring | Closure"]},
    { name:"Drawings", icon:"📐", sub:["Well_Diagrams","Facility_Layouts","P_and_ID"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Schedules"]},
  ],
  Operations: [
    { name:"Procedures", icon:"📝", sub:["EPMO_Well_Monitoring_Control","EPWM_Wellhead_Equipment_Mgmt","EPSO_Separation_Operations","EPWI_Optimization_Methods","EPWW_Waste_Mgmt","EPGR_Data_Reporting","EPOR_Outage_Restart","WWPO_Workover_Planning","WWCW_Rig_Coordination","WWRM_Rig_Transfer","WWWE_Well_Repair_Ops","WWMO_Repair_Monitoring","WWWT_Well_Testing","WWSM_Safety_Env","WWGR_Documentation","EDPT_Crude_Prep","EDMT_Flow_Monitoring","EDPO_Pipeline_Ops","EDTM_Temp_Storage","EDST_Transport_Safety","EDCP_Processing_Coord","EDDT_Transfer_Docs","EDTI_Troubleshooting"]},
    { name:"Reports", icon:"📊", sub:["Daily_Operations","Incident_Reports","Shift_Reports","Workover_Reports","Delivery_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Operation_Logs","Shift_Records","Equipment_Logs","System_Alerts","Workover_Records","Transfer_Records"]},
    { name:"Projects", icon:"📁", sub:["Shutdowns → Schedules | Approvals | Post_Report","Workovers → Planning | Execution | Results"]},
    { name:"Logs", icon:"📟", sub:["Equipment_Logs","System_Alerts","SCADA_Data"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Emergency_Drills"]},
  ],
  TechnicalInspection: [
    { name:"Procedures", icon:"📝", sub:["TITP_Inspection_Planning","TIVI_Visual_Inspection","TIND_NDT","TIPL_Pipeline_Integrity","TIPV_Pressure_Vessel","TIWC_Wellhead_Insp","TIGR_Documentation","TIRA_Root_Cause","TIAD_Asset_DB_Update","TIIA_Audit_Review","PQCS_Quality_Sampling","PQMC_Quality_Monitoring","PQPI_Separation_Quality","PQQT_Quality_Transfer","PQQR_Quality_Reporting","PQDM_Deviation_Actions","PQCR_Standards_Compliance","PQQP_Digital_Quality"]},
    { name:"Reports", icon:"📊", sub:["Periodic_Inspections","Defect_Findings","NDT_Reports","Pipeline_Reports","Root_Cause_Reports","Quality_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Equipment_Insp_History","Quality_Certificates","NDT_Records","TIAD_Asset_Integrity_DB","Quality_Records"]},
    { name:"Projects", icon:"📁", sub:["Major_Inspections → Inspections | Repairs | Findings"]},
    { name:"Certifications", icon:"🏅", sub:["ISO_Certificates","Compliance_Records","Equipment_Certs"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","NDT_Qualifications"]},
  ],
  Maintenance: [
    { name:"Procedures", icon:"📝", sub:["MAMO_Equipment_Monitoring","MAPM_Preventive_Maint","MAAI_Asset_Integrity","MACM_Corrective_Maint","MASI_Spare_Parts","MAFO_Facility_Opt","MAES_Equipment_Safety","MAGR_Documentation"]},
    { name:"Reports", icon:"📊", sub:["Completed_Repairs","Failure_Analysis","PM_Compliance","Asset_Integrity_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Equipment_Maint_History","Spare_Parts_List","Work_Orders_History","PM_Schedules_History"]},
    { name:"Projects", icon:"📁", sub:["WorkOrders → Open | In_Progress | Completed","Schedules → PM_Schedule | CM_Schedule"]},
    { name:"Inventory", icon:"📦", sub:["Tools_Inventory","Parts_Catalog","Spare_Parts_by_Equip"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Safety_Training"]},
  ],
  Planning: [
    { name:"Procedures", icon:"📝", sub:["PPRF_Forecasting","PPDP_Plan_Development","PPEO_Opt_Planning","PLPT_Transport_Planning","PLCM_Pipeline_Capacity","PLMO_Logistics_Forecast","PLMS_Contractor_Coord","PLRM_Logistics_Risk","PLOT_Route_Opt","PLGR_Logistics_Docs"]},
    { name:"Reports", icon:"📊", sub:["Project_Progress","Budget_Reports","Production_Plans","Logistics_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Timelines","Gantt_Charts","Resource_Allocation","Historical_Plans"]},
    { name:"Projects", icon:"📁", sub:["_Template → Milestones | Resources | Budget | Schedule"]},
    { name:"Budgets", icon:"💰", sub:["Annual_Budget","Forecasts","Department_Budgets"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Software_Training"]},
  ],
  HSE: [
    { name:"Procedures", icon:"📝", sub:["HSIM_Risk_ID","HSEC_Env_Compliance","HSEP_Production_Safety","HSMP_Asset_Safety","HSED_Delivery_Safety","HSMQ_Quality_Safety","HSMI_Info_Mgmt","HSMA_Maint_Safety"]},
    { name:"Reports", icon:"📊", sub:["Incident_Reports","Safety_Audits","Environmental_Reports","Risk_Assessment"]},
    { name:"Records", icon:"🗃️", sub:["Safety_Training_Rec","Env_Permits","Incident_History","Near_Miss_Records"]},
    { name:"Projects", icon:"📁", sub:["Drills → Plans | Results | Lessons_Learned","Risk_Assessments → Current | Historical"]},
    { name:"Audits", icon:"🔎", sub:["HSE_Audit_Reports","Corrective_Actions","Follow_Up_Reports"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Emergency_Plans"]},
  ],
  HR: [
    { name:"Procedures", icon:"📝", sub:["HRHC_HR_Planning","HRRS_Recruitment","HRTD_Training_Dev","HRPM_Performance","HRCB_Compensation","HRER_Employee_Rel","HRWH_Wellness","HRDI_DEI","HRST_Separation"]},
    { name:"Reports", icon:"📊", sub:["Workforce_Reports","Payroll_Reports","Training_Reports","Performance_Reports"]},
    { name:"Records 🔒", icon:"🗃️", sub:["Employee_Files 🔒","Contracts","Training_Records","Benefits_Records"]},
    { name:"Projects", icon:"📁", sub:["Recruitment → Job_Postings | Interviews | Onboarding","Training_Programs → Planning | Execution | Evaluation"]},
    { name:"Payroll", icon:"💵", sub:["Monthly_Payroll","Benefits_Records","Tax_Documents"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Development_Plans"]},
  ],
  Finance: [
    { name:"Procedures", icon:"📝", sub:["Accounting_Procedures","Budget_Control","Financial_Reporting","Audit_Procedures"]},
    { name:"Reports", icon:"📊", sub:["Monthly_Financial","Quarterly_Financial","Annual_Financial","Audit_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Invoices_Register","Balance_Sheets","Ledger_Records","Tax_Records"]},
    { name:"Projects", icon:"📁", sub:["Budgeting → Forecasts | Approvals | Reviews"]},
    { name:"Invoices", icon:"🧾", sub:["Incoming","Outgoing","Processed"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Software_Training"]},
  ],
  /* ════════════ NEW: Supply Chain — full department ════════════ */
  SupplyChain: [
    { name:"Procedures", icon:"📝", sub:["SCSP_SC_Planning","SCSM_Source_Mgmt","SCPC_Procurement","SCLT_Logistics_Transport","SCST_Service_Mgmt","SCIM_Customer_Rel","SCSI_Chain_Improvement"]},
    { name:"Reports", icon:"📊", sub:["SC_Performance","Procurement_Reports","Logistics_Reports","Supplier_Evaluation","Service_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Procurement_History","Supplier_Records","Service_Records","Logistics_Records","Innovation_Records"]},
    { name:"Projects", icon:"📁", sub:["Logistics → Schedules | Vendors | Routes","Procurement → RFQs | Orders | Delivery","Improvement → Ideas | Pilot | Results"]},
    { name:"Contracts", icon:"📜", sub:["Vendor_Contracts","Service_Agreements","Framework_Agreements","Innovation_Agreements"]},
    { name:"Suppliers", icon:"🏪", sub:["Supplier_List","Supplier_Evaluations","Supplier_Contracts","Approved_Vendors"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Procurement_Training","Logistics_Training"]},
  ],
  /* ════════════ NEW: Organization Excellency — full department ════════════ */
  OrgExcellency: [
    { name:"Procedures", icon:"📝", sub:["OEQA_Quality_Assurance","OECI_Continuous_Improvement","OEBM_Benchmarking","OEAR_Audit_Review","OELD_Leadership_Development","OEKM_Knowledge_Mgmt","OECR_Certification","OEGR_Documentation"]},
    { name:"Reports", icon:"📊", sub:["QA_Audit_Reports","Excellence_KPI_Reports","Improvement_Progress","Benchmarking_Reports","Annual_Excellence_Report"]},
    { name:"Records", icon:"🗃️", sub:["Audit_History","Improvement_Records","Certification_Records","Best_Practices_Archive","Lessons_Learned"]},
    { name:"Projects", icon:"📁", sub:["Excellence_Initiatives → Planning | Execution | Results","QA_Audits → Schedule | Findings | Closure","Benchmarking → Data | Analysis | Recommendations"]},
    { name:"Standards", icon:"📋", sub:["ISO_Standards","Industry_Best_Practices","Internal_Standards","Excellence_Framework"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Excellence_Workshops","Leadership_Training"]},
  ],
  /* ════════════ END NEW ════════════ */
  Warehouse: [
    { name:"Procedures", icon:"📝", sub:["Warehousing_Procedures","Inventory_Control","LIFO_FIFO_Mgmt","Safety_Stock_Mgmt"]},
    { name:"Reports", icon:"📊", sub:["Inventory_Reports","Stock_Turnover","Storage_Utilization","Audit_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Inventory_List","In_Out_Records","Damage_Records","Expiry_Tracking"]},
    { name:"Projects", icon:"📁", sub:["Inventory_Audits → Audit_Plans | Results | Corrective_Actions"]},
    { name:"Suppliers", icon:"🏪", sub:["Supplier_List","Supplier_Evaluations","Supplier_Contracts"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Safety_Training"]},
  ],
  IT: [
    { name:"Procedures", icon:"📝", sub:["IT_Policies","Data_Security","Incident_Response","Change_Mgmt","HSMI_Info_Mgmt"]},
    { name:"Reports", icon:"📊", sub:["System_Reports","Incident_Reports","Performance_Reports","Security_Reports"]},
    { name:"Records", icon:"🗃️", sub:["Backup_History","Software_Licenses","Asset_Register","Access_Logs"]},
    { name:"Projects", icon:"📁", sub:["System_Upgrades → Plans | Implementation | Testing | Deployment"]},
    { name:"Backups 🔒", icon:"💾", sub:["System_Backups 🔒","Database_Backups 🔒","File_Backups 🔒"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Security_Awareness"]},
  ],
  Support: [
    { name:"Procedures", icon:"📝", sub:["SUGS_General_Support","SUHD_Helpdesk_Mgmt","SUAD_Administrative_Support","SULG_Logistics_Coord","SUFN_Facilities_Mgmt","SUSR_Supplier_Relations","SUGR_Documentation","SUDT_Digital_Tools"]},
    { name:"Reports", icon:"📊", sub:["Support_Performance","Helpdesk_Reports","Coordination_Reports","Monthly_Summary"]},
    { name:"Records", icon:"🗃️", sub:["Support_Tickets","Coordination_Records","Service_Records"]},
    { name:"Projects", icon:"📁", sub:["Support_Improvement → Plans | Execution | Review"]},
    { name:"Contracts", icon:"📜", sub:["Service_Agreements","Support_Contracts","SLA_Documents"]},
    { name:"Training", icon:"🎓", sub:["Materials","Certifications","Support_Training"]},
  ],
};

/* ═══════════════════════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function SubItem({ name, mob }) {
  const locked = name.includes("🔒");
  const hasChild = name.includes("→");
  const [parent, childStr] = hasChild ? name.split(" → ") : [name, ""];
  const children = hasChild ? childStr.split(" | ") : [];
  return (
    <div style={{ marginLeft: mob ? 14 : 18 }}>
      <div style={{ display:"flex", alignItems:"center", gap: mob?5:7, padding: mob?"3px 0":"4px 0" }}>
        <span style={{ color:"#94a3b8", fontSize: mob?12:14 }}>├─</span>
        <span style={{ fontSize: mob?14:16 }}>{hasChild ? "📁" : locked ? "🔒" : "📄"}</span>
        <span style={{ fontSize: mob?12:14, color: locked?"#ef4444":"#30657ad2", fontFamily:"'Consolas','Courier New',monospace", fontWeight: locked?600:400, wordBreak:"break-all" }}>{parent}</span>
      </div>
      {children.map((c, i) => (
        <div key={i} style={{ marginLeft: mob?24:30, display:"flex", alignItems:"center", gap: mob?5:7, padding: mob?"2px 0":"2.5px 0" }}>
          <span style={{ color:"#64748b", fontSize: mob?11:13 }}>└─</span>
          <span style={{ fontSize: mob?12:14 }}>📁</span>
          <span style={{ fontSize: mob?12:14, color:"#8b949e", fontFamily:"'Consolas','Courier New',monospace" }}>{c.trim()}</span>
        </div>
      ))}
    </div>
  );
}

function FolderCard({ folder, color, mob }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:"#fff", borderRadius: mob?8:10, border:`1px solid ${color}25`, overflow:"hidden", marginBottom: mob?6:8 }}>
      <div onClick={() => setOpen(!open)} style={{
        display:"flex", alignItems:"center", gap: mob?7:10, padding: mob?"10px 14px":"12px 18px",
        cursor:"pointer", background:`${color}08`, borderBottom:`1px solid ${color}15`, userSelect:"none"
      }}>
        <span style={{ fontSize: mob?11:14, color, transition:"transform .15s", transform: open?"rotate(90deg)":"rotate(0)" }}>▶</span>
        <span style={{ fontSize: mob?17:20 }}>{folder.icon}</span>
        <span style={{ fontSize: mob?13:16, fontWeight:600, color, fontFamily:"'Consolas','Courier New',monospace" }}>{folder.name}</span>
        <span style={{ marginLeft:"auto", fontSize: mob?11:13, color:"#94a3b8", background:"#f1f5f9", borderRadius:10, padding: mob?"2px 7px":"2px 8px", fontWeight:600 }}>{folder.sub.length}</span>
      </div>
      {open && <div style={{ padding: mob?"7px 0 8px":"9px 0 10px" }}>{folder.sub.map((s,i)=><SubItem key={i} name={s} mob={mob}/>)}</div>}
    </div>
  );
}

function ProcessTable({ list, mob }) {
  const groups = useMemo(() => {
    const m = {};
    list.forEach(p => { (m[p.group] = m[p.group] || []).push(p); });
    return m;
  }, [list]);
  return (
    <div style={{ overflowX:"auto" }}>
      {Object.entries(groups).map(([grp, items]) => (
        <div key={grp} style={{ marginBottom: mob?14:20 }}>
          <div style={{ fontSize: mob?13:15, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:0.6, padding: mob?"4px 0":"6px 0", borderBottom:"2px solid #e2e8f0", marginBottom: mob?4:6 }}>{grp}</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize: mob?12:14 }}>
            <tbody>
              {items.map((p, i) => (
                <tr key={i} style={{ background: i%2===0?"#f8fafc":"#fff" }}>
                  <td style={{ padding: mob?"5px 8px":"7px 12px", fontFamily:"'Consolas','Courier New',monospace", fontWeight:700, color:"#2563eb", width: mob?60:76, whiteSpace:"nowrap", fontSize: mob?13:15 }}>{p.tag}</td>
                  <td style={{ padding: mob?"5px 8px":"7px 12px", color:"#1e293b", fontSize: mob?12:14 }}>{p.en}</td>
                  {!mob && <td style={{ padding:"7px 12px", color:"#64748b", direction:"rtl", textAlign:"right", fontSize:14 }}>{p.fa}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
   ═══════════════════════════════════════════════════════════ */

export default function App() {
  const vw = useWindowSize();
  const mob = vw < 680;
  const tab = vw >= 680 && vw < 1100;
  const cols = mob ? 1 : tab ? 2 : 3;

  const [activeDept, setActiveDept] = useState(null);
  const [search, setSearch]         = useState("");
  const [view, setView]             = useState("tree");

  const dept = DEPTS.find(d => d.id === activeDept);

  const filteredProcesses = useMemo(() => {
    let list = activeDept ? PROCESSES.filter(p => p.dept === activeDept) : PROCESSES;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.tag.toLowerCase().includes(q) || p.en.toLowerCase().includes(q) || p.fa.includes(q) || p.group.toLowerCase().includes(q));
    }
    return list;
  }, [activeDept, search]);

  const visibleDepts = activeDept ? DEPTS.filter(d => d.id === activeDept) : DEPTS;

  const totalFolders = useMemo(() => Object.values(DEPT_FOLDERS).reduce((a,v)=> a + v.reduce((s,f)=> s+1+f.sub.length, 0), 0), []);

  return (
    <div style={{
      minHeight:"100vh", width:"100vw", boxSizing:"border-box", overflowX:"hidden",
      background:"linear-gradient(150deg, #0d1117 0%, #161b22 45%, #1c2333 100%)",
      fontFamily:"'Vazir', 'Segoe UI', system-ui, sans-serif",
      color:"#e6edf3", padding: mob?"18px 14px":"30px 30px"
    }}>

      {/* ─── HEADER ─── */}
      <div style={{ width:"100%", textAlign:"center", marginBottom:6 }}>
        <div style={{ display:"inline-block", background:"rgba(233,69,96,.1)", border:"1px solid rgba(233,69,96,.28)", borderRadius:20, padding: mob?"5px 18px":"6px 24px", fontSize: mob?11:13, color:"#e94560", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>
          Document Control Center — DCC
        </div>
        <h1 style={{ margin:0, fontSize: mob?30:tab?38:46, fontWeight:800, lineHeight:1.2 }}>
          <span style={{ background:"linear-gradient(135deg,#e94560,#c23152)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>سپهر پاسارگاد</span>
        </h1>
        <p style={{ margin:"8px 0 0", fontSize: mob?14:17, color:"#8b949e", letterSpacing:0.5 }}>Sepehr Pasargad Oil & Gas — DCC Folder Structure & Process Mapping</p>
      </div>

      {/* ─── STATS ROW ─── */}
      <div style={{ width:"100%", marginTop:24, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: mob?10:20 }}>
        {[
          { l:"DEPARTMENTS",   v: DEPTS.length,     i:"🏗️", c:"#e94560" },
          { l:"PROCESS TAGS",  v: PROCESSES.length,  i:"🔖", c:"#3498db" },
          { l:"TOTAL FOLDERS", v: totalFolders,      i:"📁", c:"#2ecc71" },
        ].map((s,i)=>(
          <div key={i} style={{ background:"rgba(255,255,255,.055)", border:"1px solid rgba(255,255,255,.1)", borderRadius: mob?12:14, padding: mob?"18px 10px":"24px 18px", textAlign:"center" }}>
            <div style={{ fontSize: mob?26:32 }}>{s.i}</div>
            <div style={{ fontSize: mob?32:42, fontWeight:800, color:s.c, marginTop:3, lineHeight:1.1 }}>{s.v}</div>
            <div style={{ fontSize: mob?10:13, color:"#6e7681", textTransform:"uppercase", letterSpacing:1.2, marginTop:5, fontWeight:600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ─── DEPT PILLS ─── */}
      <div style={{ width:"100%", marginTop:22, display:"flex", flexWrap:"wrap", gap: mob?6:8, justifyContent:"center" }}>
        <button onClick={()=>{ setActiveDept(null); setSearch(""); }} style={{
          padding: mob?"7px 18px":"9px 22px", borderRadius:20, border: !activeDept?"1.5px solid #e94560":"1px solid rgba(255,255,255,.18)",
          background: !activeDept?"rgba(233,69,96,.2)":"rgba(255,255,255,.06)",
          color: !activeDept?"#e94560":"#8b949e", fontSize: mob?12:14, cursor:"pointer", fontWeight:700, transition:"all .15s"
        }}>All</button>
        {DEPTS.map(d=>(
          <button key={d.id} onClick={()=>{ setActiveDept(d.id); setSearch(""); }} style={{
            padding: mob?"7px 12px":"9px 15px", borderRadius:20, border: activeDept===d.id?`1.5px solid ${d.color}`:`1px solid ${d.color}40`,
            background: activeDept===d.id?`${d.color}28`:"rgba(255,255,255,.06)",
            color: activeDept===d.id?d.color:"#8b949e", fontSize: mob?12:13.5, cursor:"pointer", fontWeight:500, transition:"all .15s"
          }}>{d.icon} {d.fa}</button>
        ))}
      </div>

      {/* ─── SEARCH + VIEW TOGGLE ─── */}
      <div style={{ width:"100%", marginTop:18, display:"flex", gap: mob?8:12, alignItems:"center", flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  جستجو پوشه، TAG یا فرآیند..."
          style={{ flex:"1 1 200px", minWidth:0, padding: mob?"12px 18px":"15px 22px", borderRadius:10, border:"1px solid rgba(255,255,255,.16)", background:"rgba(255,255,255,.08)", color:"#fff", fontSize: mob?14:16, outline:"none" }}/>
        {["tree","processes"].map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{
            padding: mob?"12px 18px":"15px 22px", borderRadius:10,
            border: view===v?"1.5px solid #e94560":"1px solid rgba(255,255,255,.16)",
            background: view===v?"rgba(233,69,96,.18)":"rgba(255,255,255,.06)",
            color: view===v?"#e94560":"#8b949e", fontSize: mob?13:15, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap", transition:"all .15s"
          }}>{v==="tree"?"📁 Folder Tree":"🔖 Processes"}</button>
        ))}
      </div>

      {/* ═══════════ MAIN PANEL ═══════════ */}
      <div style={{ width:"100%", marginTop:20 }}>

        {view === "tree" && (
          <>
            {/* ROOT BAR */}
            <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", border:"1px solid #e94560", borderRadius:"12px 12px 0 0", padding: mob?"14px 18px":"18px 28px", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize: mob?22:26 }}>🏢</span>
              <span style={{ fontFamily:"'Consolas','Courier New',monospace", fontSize: mob?20:26, fontWeight:700, color:"#fff" }}>SepehrPasargad_OG</span>
              <span style={{ fontSize: mob?12:14, color:"#e94560", marginLeft:"auto", opacity:.85, fontWeight:600 }}>Root Folder</span>
            </div>

            {/* SHARED + ARCHIVES */}
            <div style={{ background:"rgba(255,255,255,.035)", borderLeft:"1px solid rgba(255,255,255,.08)", borderRight:"1px solid rgba(255,255,255,.08)", padding: mob?"14px 18px 12px":"20px 28px 14px", display:"flex", gap: mob?22:40, flexWrap:"wrap" }}>
              {[
                { name:"Shared", icon:"🔗", sub:["Policies","Standards","Templates → Report_Templates | Procedure_Templates | Form_Templates"] },
                { name:"Archives", icon:"📦", sub:["2024","2023","2022"] },
              ].map((f,i)=>(
                <div key={i} style={{ flex:"1 1 180px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <span style={{ fontSize: mob?20:23 }}>{f.icon}</span>
                    <span style={{ fontFamily:"'Consolas','Courier New',monospace", fontSize: mob?16:19, fontWeight:600, color:"#8b949e" }}>{f.name}</span>
                  </div>
                  {f.sub.map((s,j)=><SubItem key={j} name={s} mob={mob}/>)}
                </div>
              ))}
            </div>

            {/* DEPARTMENTS LABEL */}
            <div style={{ background:"rgba(255,255,255,.06)", borderLeft:"1px solid rgba(255,255,255,.08)", borderRight:"1px solid rgba(255,255,255,.08)", padding: mob?"12px 18px":"14px 28px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize: mob?22:26 }}>🏗️</span>
              <span style={{ fontFamily:"'Consolas','Courier New',monospace", fontSize: mob?18:22, fontWeight:700, color:"#c9d1d9" }}>Departments</span>
            </div>

            {/* DEPT GRID */}
            <div style={{
              background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.08)",
              borderRadius:"0 0 12px 12px", padding: mob?"14px 14px":"18px 18px",
              display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap: mob?12:16
            }}>
              {visibleDepts.map(d => {
                const folders = DEPT_FOLDERS[d.id] || [];
                const filtered = search
                  ? folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.sub.some(s => s.toLowerCase().includes(search.toLowerCase())))
                  : folders;
                return (
                  <div key={d.id} style={{ background:"#fff", borderRadius:12, border:`1.5px solid ${d.color}30`, overflow:"hidden" }}>
                    {/* dept card header */}
                    <div style={{ background:`linear-gradient(135deg,${d.color}18,${d.color}08)`, padding: mob?"12px 14px":"14px 18px", display:"flex", alignItems:"center", gap: mob?8:11, borderBottom:`3px solid ${d.color}45` }}>
                      <span style={{ fontSize: mob?22:26 }}>{d.icon}</span>
                      <span style={{ fontFamily:"'Consolas','Courier New',monospace", fontSize: mob?14:17, fontWeight:700, color:d.color }}>{d.id}</span>
                      <span style={{ fontSize: mob?11:13, color:d.color, marginLeft:"auto", background:`${d.color}16`, borderRadius:10, padding: mob?"2px 7px":"3px 9px", fontWeight:500 }}>{d.fa}</span>
                    </div>
                    {/* folder cards inside */}
                    <div style={{ padding: mob?"9px 5px 7px":"11px 7px 9px" }}>
                      {filtered.map((f,i) => <FolderCard key={i} folder={f} color={d.color} mob={mob}/>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ─── PROCESSES VIEW ─── */}
        {view === "processes" && (
          <div style={{ background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", padding: mob?"14px 18px":"18px 28px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
              <span style={{ fontSize: mob?22:26 }}>🔖</span>
              <span style={{ fontFamily:"'Consolas','Courier New',monospace", fontSize: mob?16:20, fontWeight:700, color:"#fff" }}>
                {dept ? `${dept.icon} ${dept.id}` : "All Processes"}
              </span>
              <span style={{ fontSize: mob?13:15, color:"#8b949e", marginLeft:"auto", fontWeight:500 }}>{filteredProcesses.length} processes</span>
            </div>
            <div style={{ padding: mob?16:24, background:"#fff", color:"#2d3748" }}>
              <ProcessTable list={filteredProcesses} mob={mob}/>
            </div>
          </div>
        )}
      </div>

      {/* ─── LEGEND ─── */}
      <div style={{ width:"100%", marginTop:28, display:"flex", gap: mob?18:28, flexWrap:"wrap", justifyContent:"center" }}>
        {[
          { i:"📁", l:"Folder",     c:"#3498db" },
          { i:"📝", l:"Procedures", c:"#e67e22" },
          { i:"📊", l:"Reports",    c:"#e74c3c" },
          { i:"🗃️", l:"Records",    c:"#27ae60" },
          { i:"🔒", l:"Restricted", c:"#ef4444" },
          { i:"🔖", l:"Process TAG",c:"#2563eb" },
        ].map((l,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize: mob?14:16, color:"#6e7681" }}>
            <span style={{ fontSize: mob?16:19 }}>{l.i}</span><span style={{ color:l.c, fontWeight:600 }}>{l.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
