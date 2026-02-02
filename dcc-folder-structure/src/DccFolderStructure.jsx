import { useState, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   FONTS IMPORT - Vazir/IranYekan for Persian, Roboto for English
   ═══════════════════════════════════════════════════════════ */
const FONT_STYLES = `
  @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Roboto', 'Vazir', sans-serif;
  }
  
  .font-fa {
    font-family: 'Vazir', sans-serif !important;
  }
  
  .font-en {
    font-family: 'Roboto', sans-serif !important;
  }
`;

function useWindowSize() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ═══════════════════════════════════════════════════════════
   COMPLETE PROCESS DATA - Including Warehouse, IT, Finance
   ═══════════════════════════════════════════════════════════ */

const PROCESSES = [
  // Production Engineering
  { tag:"PPRF", group:"Plan & Align Production", en:"Reservoir Forecasting & Analysis", fa:"پیش‌بینی تولید و تحلیل مخزن", dept:"ProductionEngineering" },
  { tag:"PPDP", group:"Plan & Align Production", en:"Development of Production Plan", fa:"تدوین برنامه تولید", dept:"ProductionEngineering" },
  { tag:"PPEO", group:"Plan & Align Production", en:"Extraction Optimization Planning", fa:"برنامه‌ریزی بهینه‌سازی برداشت", dept:"ProductionEngineering" },
  { tag:"PPOC", group:"Plan & Align Production", en:"Managing Operational Constraints", fa:"مدیریت محدودیت‌های عملیاتی", dept:"ProductionEngineering" },
  { tag:"PPCP", group:"Plan & Align Production", en:"Coordination with Processing & Market", fa:"هماهنگی با واحدهای فرآورش", dept:"ProductionEngineering" },
  { tag:"PPRM", group:"Plan & Align Production", en:"Production Risk Management", fa:"مدیریت ریسک‌های تولید", dept:"ProductionEngineering" },
  { tag:"PPGR", group:"Plan & Align Production", en:"Documentation & Reporting", fa:"مستندسازی و گزارش‌گیری", dept:"ProductionEngineering" },
  { tag:"PPDT", group:"Plan & Align Production", en:"Digital Technologies for Planning", fa:"فناوری‌های دیجیتال", dept:"ProductionEngineering" },
  { tag:"OPCD", group:"Monitor & Optimize", en:"Collecting & Analyzing Production Data", fa:"جمع‌آوری و تحلیل داده", dept:"ProductionEngineering" },
  { tag:"OPMO", group:"Monitor & Optimize", en:"Well Performance Monitoring", fa:"پایش عملکرد چاه‌ها", dept:"ProductionEngineering" },
  { tag:"OPWO", group:"Monitor & Optimize", en:"Well Operation Optimization", fa:"بهینه‌سازی عملیات چاه", dept:"ProductionEngineering" },
  { tag:"OPRM", group:"Monitor & Optimize", en:"Reservoir Analysis & Modeling", fa:"تحلیل و مدل‌سازی مخزن", dept:"ProductionEngineering" },
  { tag:"OPPB", group:"Monitor & Optimize", en:"Managing Production Bottlenecks", fa:"مدیریت گلوگاه‌های تولید", dept:"ProductionEngineering" },
  { tag:"OPRO", group:"Monitor & Optimize", en:"Energy & Resource Optimization", fa:"بهینه‌سازی انرژی و منابع", dept:"ProductionEngineering" },
  { tag:"OPGR", group:"Monitor & Optimize", en:"Performance Reports & Forecasts", fa:"گزارش‌های عملکرد", dept:"ProductionEngineering" },
  { tag:"OPDT", group:"Monitor & Optimize", en:"Digital Technologies for Optimization", fa:"فناوری‌های دیجیتال", dept:"ProductionEngineering" },
  
  // Operations
  { tag:"EPMO", group:"Execute Production", en:"Well Monitoring & Control", fa:"پایش و کنترل چاه‌ها", dept:"Operations" },
  { tag:"EPWM", group:"Execute Production", en:"Wellhead Equipment Management", fa:"مدیریت تجهیزات سرچاهی", dept:"Operations" },
  { tag:"EPSO", group:"Execute Production", en:"Initial Separation Operation", fa:"عملیات جداسازی اولیه", dept:"Operations" },
  { tag:"EPWI", group:"Execute Production", en:"Production Optimization Methods", fa:"روش‌های بهینه‌سازی تولید", dept:"Operations" },
  { tag:"EPWW", group:"Execute Production", en:"Wastewater & Waste Management", fa:"مدیریت پساب و زائدات", dept:"Operations" },
  { tag:"EPGR", group:"Execute Production", en:"Recording & Reporting Production Data", fa:"ثبت و گزارش‌گیری داده", dept:"Operations" },
  { tag:"EPOR", group:"Execute Production", en:"Managing Outages & Restarts", fa:"مدیریت توقفات", dept:"Operations" },
  { tag:"WWPO", group:"Well Workover with Rig", en:"Planning Well Repair Operations", fa:"برنامه‌ریزی تعمیر چاه", dept:"Operations" },
  { tag:"WWCW", group:"Well Workover with Rig", en:"Rig & Equipment Coordination", fa:"هماهنگی تجهیزات", dept:"Operations" },
  { tag:"WWRM", group:"Well Workover with Rig", en:"Rig Transfer & Installation", fa:"انتقال و نصب دکل", dept:"Operations" },
  { tag:"WWWE", group:"Well Workover with Rig", en:"Carrying Out Well Repair", fa:"اجرای تعمیر چاه", dept:"Operations" },
  { tag:"WWMO", group:"Well Workover with Rig", en:"Repair Operations Monitoring", fa:"پایش عملیات تعمیر", dept:"Operations" },
  { tag:"WWWT", group:"Well Workover with Rig", en:"Well Testing & Restarting", fa:"آزمایش و راه‌اندازی", dept:"Operations" },
  { tag:"WWSM", group:"Well Workover with Rig", en:"Safety & Environmental Mgmt", fa:"مدیریت ایمنی", dept:"Operations" },
  { tag:"WWGR", group:"Well Workover with Rig", en:"Documentation & Reporting", fa:"مستندسازی", dept:"Operations" },
  { tag:"EDPT", group:"Execute Delivery", en:"Preparing Crude Oil for Transport", fa:"آماده‌سازی نفت خام", dept:"Operations" },
  { tag:"EDMT", group:"Execute Delivery", en:"Transmission Flow Monitoring", fa:"پایش جریان انتقال", dept:"Operations" },
  { tag:"EDPO", group:"Execute Delivery", en:"Pipeline Operations Management", fa:"عملیات خطوط لوله", dept:"Operations" },
  { tag:"EDTM", group:"Execute Delivery", en:"Temporary Storage Management", fa:"مدیریت ذخیره موقت", dept:"Operations" },
  { tag:"EDST", group:"Execute Delivery", en:"Transport Safety & Environmental Mgmt", fa:"مدیریت ایمنی انتقال", dept:"Operations" },
  { tag:"EDCP", group:"Execute Delivery", en:"Coordination with Processing Unit", fa:"هماهنگی با فرآورش", dept:"Operations" },
  { tag:"EDDT", group:"Execute Delivery", en:"Transfer Operations Documentation", fa:"مستندسازی انتقال", dept:"Operations" },
  { tag:"EDTI", group:"Execute Delivery", en:"Troubleshooting & Incident Mgmt", fa:"رفع اشکال", dept:"Operations" },
  
  // Maintenance
  { tag:"MAMO", group:"Manage Production Assets", en:"Equipment Performance Monitoring", fa:"پایش عملکرد تجهیزات", dept:"Maintenance" },
  { tag:"MAPM", group:"Manage Production Assets", en:"Preventive Maintenance", fa:"نگهداری پیشگیرانه", dept:"Maintenance" },
  { tag:"MAAI", group:"Manage Production Assets", en:"Asset Integrity Management", fa:"مدیریت یکپارچگی دارایی", dept:"Maintenance" },
  { tag:"MACM", group:"Manage Production Assets", en:"Corrective Maintenance", fa:"تعمیرات اصلاحی", dept:"Maintenance" },
  { tag:"MASI", group:"Manage Production Assets", en:"Spare Parts Inventory Mgmt", fa:"مدیریت موجودی یدکی", dept:"Maintenance" },
  { tag:"MAFO", group:"Manage Production Assets", en:"Facility Performance Optimization", fa:"بهینه‌سازی تأسیسات", dept:"Maintenance" },
  { tag:"MAES", group:"Manage Production Assets", en:"Equipment & Facility Safety Mgmt", fa:"مدیریت ایمنی تجهیزات", dept:"Maintenance" },
  { tag:"MAGR", group:"Manage Production Assets", en:"Documentation & Reporting", fa:"مستندسازی", dept:"Maintenance" },
  
  // Technical Inspection
  { tag:"TITP", group:"Technical Inspection", en:"Inspection Planning", fa:"برنامه‌ریزی بازرسی", dept:"TechnicalInspection" },
  { tag:"TIVI", group:"Technical Inspection", en:"Visual & External Inspection", fa:"بازرسی چشمی", dept:"TechnicalInspection" },
  { tag:"TIND", group:"Technical Inspection", en:"Non-Destructive Testing", fa:"بازرسی غیرمخرب", dept:"TechnicalInspection" },
  { tag:"TIPL", group:"Technical Inspection", en:"Pipeline Integrity Inspection", fa:"یکپارچگی خطوط", dept:"TechnicalInspection" },
  { tag:"TIPV", group:"Technical Inspection", en:"Pressure Vessel & Tank Inspection", fa:"بازرسی مخازن", dept:"TechnicalInspection" },
  { tag:"TIWC", group:"Technical Inspection", en:"Wellhead Equipment Inspection", fa:"بازرسی سرچاه", dept:"TechnicalInspection" },
  { tag:"TIGR", group:"Technical Inspection", en:"Documentation & Reporting", fa:"مستندسازی", dept:"TechnicalInspection" },
  { tag:"TIRA", group:"Technical Inspection", en:"Root Cause Analysis", fa:"تحلیل ریشه‌ای", dept:"TechnicalInspection" },
  { tag:"TIAD", group:"Technical Inspection", en:"Asset Integrity DB Update", fa:"پایگاه داده یکپارچگی", dept:"TechnicalInspection" },
  { tag:"TIIA", group:"Technical Inspection", en:"Inspection Program Audit & Review", fa:"ممیزی بازرسی", dept:"TechnicalInspection" },
  { tag:"PQCS", group:"Manage Product Quality", en:"Crude Oil Quality Sampling", fa:"نمونه‌برداری کیفیت", dept:"TechnicalInspection" },
  { tag:"PQMC", group:"Manage Product Quality", en:"Quality Parameter Monitoring", fa:"پایش پارامترهای کیفی", dept:"TechnicalInspection" },
  { tag:"PQPI", group:"Manage Product Quality", en:"Primary Separation for Quality", fa:"جداسازی اولیه", dept:"TechnicalInspection" },
  { tag:"PQQT", group:"Manage Product Quality", en:"Quality Control in Transfer", fa:"کنترل کیفیت انتقال", dept:"TechnicalInspection" },
  { tag:"PQQR", group:"Manage Product Quality", en:"Quality Documentation & Reporting", fa:"مستندسازی کیفیت", dept:"TechnicalInspection" },
  { tag:"PQDM", group:"Manage Product Quality", en:"Deviation & Corrective Actions", fa:"مدیریت انحرافات", dept:"TechnicalInspection" },
  { tag:"PQCR", group:"Manage Product Quality", en:"Standards & Regulatory Compliance", fa:"انطباق با استانداردها", dept:"TechnicalInspection" },
  { tag:"PQQP", group:"Manage Product Quality", en:"Digital Quality Optimization", fa:"بهینه‌سازی دیجیتال", dept:"TechnicalInspection" },
  
  // Planning
  { tag:"PLPT", group:"Plan Logistics & Delivery", en:"Crude Oil Transportation Plan", fa:"برنامه انتقال نفت", dept:"Planning" },
  { tag:"PLCM", group:"Plan Logistics & Delivery", en:"Pipeline Capacity Management", fa:"مدیریت ظرفیت خطوط", dept:"Planning" },
  { tag:"PLMO", group:"Plan Logistics & Delivery", en:"Logistics Needs Forecasting", fa:"پیش‌بینی نیازهای لجستیک", dept:"Planning" },
  { tag:"PLMS", group:"Plan Logistics & Delivery", en:"Contractor & Supplier Coordination", fa:"هماهنگی پیمانکاران", dept:"Planning" },
  { tag:"PLRM", group:"Plan Logistics & Delivery", en:"Logistics Risk Management", fa:"مدیریت ریسک لجستیک", dept:"Planning" },
  { tag:"PLOT", group:"Plan Logistics & Delivery", en:"Route & Cost Optimization", fa:"بهینه‌سازی مسیرها", dept:"Planning" },
  { tag:"PLGR", group:"Plan Logistics & Delivery", en:"Logistics Plans Documentation", fa:"مستندسازی لجستیک", dept:"Planning" },
  
  // HSE
  { tag:"HSIM", group:"HSE", en:"Risk Identification & Mitigation", fa:"شناسایی ریسک", dept:"HSE" },
  { tag:"HSEC", group:"HSE", en:"Environmental Compliance", fa:"انطباق زیست‌محیطی", dept:"HSE" },
  { tag:"HSEP", group:"HSE", en:"Production Operations Safety", fa:"ایمنی تولید", dept:"HSE" },
  { tag:"HSMP", group:"HSE", en:"Production Asset Safety", fa:"ایمنی دارایی", dept:"HSE" },
  { tag:"HSED", group:"HSE", en:"Delivery Safety", fa:"ایمنی تحویل", dept:"HSE" },
  { tag:"HSMQ", group:"HSE", en:"Product Quality Safety", fa:"ایمنی کیفیت", dept:"HSE" },
  { tag:"HSMI", group:"HSE", en:"Information Management", fa:"مدیریت اطلاعات", dept:"HSE" },
  { tag:"HSMA", group:"HSE", en:"Asset Maintenance Safety", fa:"ایمنی نگهداری", dept:"HSE" },
  
  // HR
  { tag:"HRHC", group:"Human Capital Mgmt", en:"Human Capital Planning", fa:"برنامه‌ریزی منابع انسانی", dept:"HR" },
  { tag:"HRRS", group:"Human Capital Mgmt", en:"Recruitment & Selection", fa:"جذب و استخدام", dept:"HR" },
  { tag:"HRTD", group:"Human Capital Mgmt", en:"Training & Development", fa:"آموزش و توسعه", dept:"HR" },
  { tag:"HRPM", group:"Human Capital Mgmt", en:"Performance Management", fa:"ارزیابی عملکرد", dept:"HR" },
  { tag:"HRCB", group:"Human Capital Mgmt", en:"Compensation & Benefits", fa:"حقوق و مزایا", dept:"HR" },
  { tag:"HRER", group:"Human Capital Mgmt", en:"Employee Relations", fa:"روابط کارکنان", dept:"HR" },
  { tag:"HRWH", group:"Human Capital Mgmt", en:"Wellness, Health & Family", fa:"رفاه و سلامت", dept:"HR" },
  { tag:"HRDI", group:"Human Capital Mgmt", en:"Diversity, Equity & Inclusion", fa:"تنوع و گوناگونی", dept:"HR" },
  { tag:"HRST", group:"Human Capital Mgmt", en:"Separation & Termination", fa:"خروج و جدایی", dept:"HR" },
  
  // Supply Chain
  { tag:"SCSP", group:"Supply Chain Mgmt", en:"Supply Chain Planning", fa:"برنامه‌ریزی زنجیره", dept:"SupplyChain" },
  { tag:"SCSM", group:"Supply Chain Mgmt", en:"Source Management", fa:"مدیریت تأمین‌کنندگان", dept:"SupplyChain" },
  { tag:"SCPC", group:"Supply Chain Mgmt", en:"Procurement", fa:"خرید", dept:"SupplyChain" },
  { tag:"SCLT", group:"Supply Chain Mgmt", en:"Logistics & Transportation", fa:"لجستیک و حمل", dept:"SupplyChain" },
  { tag:"SCST", group:"Supply Chain Mgmt", en:"Service Management", fa:"مدیریت خدمات", dept:"SupplyChain" },
  { tag:"SCIM", group:"Supply Chain Mgmt", en:"Internal Customer Relationship", fa:"روابط مشتری داخلی", dept:"SupplyChain" },
  { tag:"SCSI", group:"Supply Chain Mgmt", en:"Chain Improvement & Innovation", fa:"بهبود زنجیره", dept:"SupplyChain" },
  
  // Organization Excellency
  { tag:"OEQA", group:"Organization Excellency", en:"Quality Assurance", fa:"تضمین کیفیت", dept:"OrgExcellency" },
  { tag:"OECI", group:"Organization Excellency", en:"Continuous Improvement", fa:"بهبود مستمر", dept:"OrgExcellency" },
  { tag:"OEBM", group:"Organization Excellency", en:"Benchmarking & Best Practices", fa:"بنچ‌مارکینگ", dept:"OrgExcellency" },
  { tag:"OEAR", group:"Organization Excellency", en:"Audit & Review", fa:"ممیزی و بازنگری", dept:"OrgExcellency" },
  { tag:"OELD", group:"Organization Excellency", en:"Leadership Development", fa:"توسعه رهبری", dept:"OrgExcellency" },
  { tag:"OEKM", group:"Organization Excellency", en:"Knowledge Management", fa:"مدیریت دانش", dept:"OrgExcellency" },
  { tag:"OECR", group:"Organization Excellency", en:"Certification & Recognition", fa:"گواهینامه", dept:"OrgExcellency" },
  { tag:"OEGR", group:"Organization Excellency", en:"Documentation & Reporting", fa:"مستندسازی", dept:"OrgExcellency" },
  
  // Support
  { tag:"SUGS", group:"General Support", en:"General Support Services", fa:"خدمات پشتیبانی", dept:"Support" },
  { tag:"SUHD", group:"General Support", en:"Helpdesk Management", fa:"مدیریت هلپ‌دسک", dept:"Support" },
  { tag:"SUAD", group:"General Support", en:"Administrative Support", fa:"پشتیبانی اداری", dept:"Support" },
  { tag:"SULG", group:"General Support", en:"Logistics Coordination", fa:"هماهنگی لجستیک", dept:"Support" },
  { tag:"SUFN", group:"General Support", en:"Facilities Management", fa:"مدیریت تسهیلات", dept:"Support" },
  { tag:"SUSR", group:"General Support", en:"Supplier Relations", fa:"روابط تأمین‌کنندگان", dept:"Support" },
  { tag:"SUGR", group:"General Support", en:"Documentation & Reporting", fa:"مستندسازی", dept:"Support" },
  { tag:"SUDT", group:"General Support", en:"Digital Tools for Support", fa:"ابزارهای دیجیتال", dept:"Support" },
  
  // ═══ WAREHOUSE (10 processes) ═══
  { tag:"WHIP", group:"Warehouse Mgmt", en:"Inventory Planning", fa:"برنامه‌ریزی موجودی", dept:"Warehouse" },
  { tag:"WHRC", group:"Warehouse Mgmt", en:"Receiving & Control", fa:"دریافت و کنترل", dept:"Warehouse" },
  { tag:"WHST", group:"Warehouse Mgmt", en:"Storage Management", fa:"مدیریت انبارش", dept:"Warehouse" },
  { tag:"WHPI", group:"Warehouse Mgmt", en:"Picking & Issue", fa:"انتخاب و صدور", dept:"Warehouse" },
  { tag:"WHIC", group:"Warehouse Mgmt", en:"Inventory Control", fa:"کنترل موجودی", dept:"Warehouse" },
  { tag:"WHCY", group:"Warehouse Mgmt", en:"Cycle Counting", fa:"شمارش چرخه‌ای", dept:"Warehouse" },
  { tag:"WHSF", group:"Warehouse Mgmt", en:"Safety & Security", fa:"ایمنی و امنیت", dept:"Warehouse" },
  { tag:"WHSU", group:"Warehouse Mgmt", en:"Supplier Coordination", fa:"هماهنگی تأمین‌کنندگان", dept:"Warehouse" },
  { tag:"WHGR", group:"Warehouse Mgmt", en:"Documentation & Reporting", fa:"مستندسازی", dept:"Warehouse" },
  { tag:"WHOP", group:"Warehouse Mgmt", en:"Operations Optimization", fa:"بهینه‌سازی عملیات", dept:"Warehouse" },
  
  // ═══ IT (10 processes) ═══
  { tag:"ITIP", group:"IT Management", en:"IT Planning & Strategy", fa:"برنامه‌ریزی IT", dept:"IT" },
  { tag:"ITIM", group:"IT Management", en:"Infrastructure Management", fa:"مدیریت زیرساخت", dept:"IT" },
  { tag:"ITSM", group:"IT Management", en:"System Maintenance", fa:"نگهداری سیستم", dept:"IT" },
  { tag:"ITSC", group:"IT Management", en:"Security & Compliance", fa:"امنیت و انطباق", dept:"IT" },
  { tag:"ITBK", group:"IT Management", en:"Backup & Recovery", fa:"پشتیبان‌گیری", dept:"IT" },
  { tag:"ITDM", group:"IT Management", en:"Data Management", fa:"مدیریت داده", dept:"IT" },
  { tag:"ITSV", group:"IT Management", en:"Service Management", fa:"مدیریت خدمات", dept:"IT" },
  { tag:"ITAM", group:"IT Management", en:"Asset Management", fa:"مدیریت دارایی", dept:"IT" },
  { tag:"ITGR", group:"IT Management", en:"Documentation & Reporting", fa:"مستندسازی", dept:"IT" },
  { tag:"ITCP", group:"IT Management", en:"Change & Project Mgmt", fa:"مدیریت تغییر", dept:"IT" },
  
  // ═══ FINANCE (12 processes) ═══
  { tag:"FIFP", group:"Financial Mgmt", en:"Financial Planning", fa:"برنامه‌ریزی مالی", dept:"Finance" },
  { tag:"FIBC", group:"Financial Mgmt", en:"Budget Control", fa:"کنترل بودجه", dept:"Finance" },
  { tag:"FIAR", group:"Financial Mgmt", en:"Accounting & Recording", fa:"حسابداری", dept:"Finance" },
  { tag:"FIAP", group:"Financial Mgmt", en:"Accounts Payable", fa:"حساب‌های پرداختنی", dept:"Finance" },
  { tag:"FIRV", group:"Financial Mgmt", en:"Accounts Receivable", fa:"حساب‌های دریافتنی", dept:"Finance" },
  { tag:"FICM", group:"Financial Mgmt", en:"Cash Management", fa:"مدیریت وجه نقد", dept:"Finance" },
  { tag:"FIAA", group:"Financial Mgmt", en:"Asset Accounting", fa:"حسابداری دارایی", dept:"Finance" },
  { tag:"FIGR", group:"Financial Mgmt", en:"Financial Reporting", fa:"گزارش‌گیری مالی", dept:"Finance" },
  { tag:"FIIA", group:"Financial Mgmt", en:"Internal Audit", fa:"حسابرسی داخلی", dept:"Finance" },
  { tag:"FITX", group:"Financial Mgmt", en:"Tax Management", fa:"مدیریت مالیات", dept:"Finance" },
  { tag:"FICO", group:"Financial Mgmt", en:"Cost Control", fa:"کنترل هزینه", dept:"Finance" },
  { tag:"FITR", group:"Financial Mgmt", en:"Treasury Management", fa:"مدیریت خزانه", dept:"Finance" },
];

/* 13 departments */
const DEPTS = [
  { id:"ProductionEngineering", fa:"مهندسی تولید", icon:"⛽", color:"#e74c3c" },
  { id:"Operations", fa:"بهره‌برداری", icon:"🔧", color:"#2980b9" },
  { id:"TechnicalInspection", fa:"بازرسی فنی", icon:"🔍", color:"#e67e22" },
  { id:"Maintenance", fa:"تعمیرات و نگهداری", icon:"🛠️", color:"#27ae60" },
  { id:"Planning", fa:"برنامه‌ریزی", icon:"📅", color:"#8e44ad" },
  { id:"HSE", fa:"HSE", icon:"⚠️", color:"#f39c12" },
  { id:"HR", fa:"منابع انسانی", icon:"👥", color:"#1abc9c" },
  { id:"Finance", fa:"مالی", icon:"💰", color:"#2ecc71" },
  { id:"SupplyChain", fa:"زنجیره تأمین", icon:"🚛", color:"#e91e63" },
  { id:"OrgExcellency", fa:"تعالی سازمانی", icon:"🏆", color:"#ff9800" },
  { id:"Warehouse", fa:"انبار", icon:"🏭", color:"#d35400" },
  { id:"IT", fa:"فناوری اطلاعات", icon:"💻", color:"#9b59b6" },
  { id:"Support", fa:"پشتیبانی", icon:"🤝", color:"#3498db" },
];

/* ═══════════════════════════════════════════════════════════
   IMPROVED FOLDER STRUCTURE
   - Procedures, Training, Drawings moved to Shared
   - Reports include year subfolders (2024-2020)
   ═══════════════════════════════════════════════════════════ */
const DEPT_FOLDERS = {
  ProductionEngineering: [
    { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Daily_Production_Data","Sensor_Logs","Well_Charts","Forecasts_History"] },
    { name:"Projects", icon:"📁", sub:["_Template → Planning | Execution | Monitoring | Closure"] },
  ],
  Operations: [
{ name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Operation_Logs","Shift_Records","Equipment_Logs","System_Alerts"] },
    { name:"Projects", icon:"📁", sub:["Shutdowns → Schedules | Approvals | Post_Report","Workovers → Planning | Execution"] },
    { name:"Logs", icon:"📟", sub:["Equipment_Logs","System_Alerts","SCADA_Data"] },
  ],
  TechnicalInspection: [
    { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Equipment_Insp_History","Quality_Certificates","NDT_Records"] },
    { name:"Projects", icon:"📁", sub:["Major_Inspections → Inspections | Repairs | Findings"] },
    { name:"Certifications", icon:"🏅", sub:["ISO_Certificates","Compliance_Records","Equipment_Certs"] },
  ],
  Maintenance: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Equipment_Maint_History","Spare_Parts_List","Work_Orders_History"] },
    { name:"Projects", icon:"📁", sub:["WorkOrders → Open | In_Progress | Completed"] },
    { name:"Inventory", icon:"📦", sub:["Tools_Inventory","Parts_Catalog","Spare_Parts_by_Equip"] },
  ],
  Planning: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Timelines","Gantt_Charts","Resource_Allocation","Historical_Plans"] },
    { name:"Projects", icon:"📁", sub:["_Template → Milestones | Resources | Budget | Schedule"] },
    { name:"Budgets", icon:"💰", sub:["Annual_Budget","Forecasts","Department_Budgets"] },
  ],
  HSE: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Safety_Training_Rec","Env_Permits","Incident_History","Near_Miss_Records"] },
    { name:"Projects", icon:"📁", sub:["Drills → Plans | Results | Lessons_Learned"] },
    { name:"Audits", icon:"🔎", sub:["HSE_Audit_Reports","Corrective_Actions","Follow_Up_Reports"] },
  ],
  HR: [
  { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records 🔒", icon:"🗃️", sub:["Employee_Files 🔒","Contracts","Training_Records","Benefits_Records"] },
    { name:"Projects", icon:"📁", sub:["Recruitment → Job_Postings | Interviews | Onboarding"] },
    { name:"Payroll", icon:"💵", sub:["Monthly_Payroll","Benefits_Records","Tax_Documents"] },
  ],
  Finance: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Invoices_Register","Balance_Sheets","Ledger_Records","Tax_Records"] },
    { name:"Projects", icon:"📁", sub:["Budgeting → Forecasts | Approvals | Reviews"] },
    { name:"Invoices", icon:"🧾", sub:["Incoming","Outgoing","Processed"] },
  ],
  SupplyChain: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Procurement_History","Supplier_Records","Service_Records"] },
    { name:"Projects", icon:"📁", sub:["Logistics → Schedules | Vendors | Routes","Procurement → RFQs | Orders | Delivery"] },
    { name:"Contracts", icon:"📜", sub:["Vendor_Contracts","Service_Agreements","Framework_Agreements"] },
    { name:"Suppliers", icon:"🏪", sub:["Supplier_List","Supplier_Evaluations","Approved_Vendors"] },
  ],
  OrgExcellency: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Audit_History","Improvement_Records","Certification_Records","Best_Practices"] },
    { name:"Projects", icon:"📁", sub:["Excellence_Initiatives → Planning | Execution | Results"] },
    { name:"Standards", icon:"📋", sub:["ISO_Standards","Industry_Best_Practices","Internal_Standards"] },
  ],
  Warehouse: [
    { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Inventory_List","In_Out_Records","Damage_Records","Expiry_Tracking"] },
    { name:"Projects", icon:"📁", sub:["Inventory_Audits → Audit_Plans | Results | Corrective_Actions"] },
    { name:"Suppliers", icon:"🏪", sub:["Supplier_List","Supplier_Evaluations","Supplier_Contracts"] },
  ],
  IT: [
 { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Backup_History","Software_Licenses","Asset_Register","Access_Logs"] },
    { name:"Projects", icon:"📁", sub:["System_Upgrades → Plans | Implementation | Testing | Deployment"] },
    { name:"Backups 🔒", icon:"💾", sub:["System_Backups 🔒","Database_Backups 🔒","File_Backups 🔒"] },
  ],
  Support: [
   { name:"Reports", icon:"📊", sub:["2026 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "] },
    { name:"Records", icon:"🗃️", sub:["Support_Tickets","Coordination_Records","Service_Records"] },
    { name:"Projects", icon:"📁", sub:["Support_Improvement → Plans | Execution | Review"] },
    { name:"Contracts", icon:"📜", sub:["Service_Agreements","Support_Contracts","SLA_Documents"] },
  ],
};

/* ═══════════════════════════════════════════════════════════
   UI COMPONENTS - Compact & Modern
   ═══════════════════════════════════════════════════════════ */

function SubItem({ name, mob, darkMode }) {
  const locked = name.includes("🔒");
  const hasChild = name.includes("→");
  const [parent, childStr] = hasChild ? name.split(" → ") : [name, ""];
  const children = hasChild ? childStr.split(" | ") : [];
  
  const textColor = locked ? "#ef4444" : darkMode ? "#74b3cad2" : "#4b5563";
  
  return (
    <div style={{ marginLeft: mob ? 10 : 14 }}>
      <div style={{ display:"flex", alignItems:"center", gap: mob?4:5, padding: mob?"2px 0":"3px 0" }}>
        <span style={{ color: darkMode ? "#94a3b8" : "#9ca3af", fontSize: mob?10:11 }}>├─</span>
        <span style={{ fontSize: mob?12:13 }}>{hasChild ? "📁" : locked ? "🔒" : "📄"}</span>
        <span className="font-en" style={{ fontSize: mob?10:11, color: textColor, fontWeight: locked?600:400 }}>{parent}</span>
      </div>
      {children.map((c, i) => (
        <div key={i} style={{ marginLeft: mob?18:24, display:"flex", alignItems:"center", gap: mob?4:5, padding: mob?"1px 0":"2px 0" }}>
          <span style={{ color: darkMode ? "#64748b" : "#9ca3af", fontSize: mob?9:10 }}>└─</span>
          <span style={{ fontSize: mob?11:12 }}>📁</span>
          <span className="font-en" style={{ fontSize: mob?10:11, color: darkMode ? "#8b949e" : "#6b7280" }}>{c.trim()}</span>
        </div>
      ))}
    </div>
  );
}

function FolderCard({ folder, color, mob, darkMode }) {
  const [open, setOpen] = useState(false);
  const bgColor = darkMode ? "rgba(28, 25, 25, 0.98)" : "rgba(255, 255, 255, 0.95)";
  const headerBg = darkMode ? `${color}08` : `${color}15`;
  
  return (
    <div style={{ background: bgColor, borderRadius: mob?6:8, border:`1px solid ${color}25`, overflow:"hidden", marginBottom: mob?5:6 }}>
      <div onClick={() => setOpen(!open)} style={{
        display:"flex", alignItems:"center", gap: mob?5:7, padding: mob?"8px 10px":"9px 12px",
        cursor:"pointer", background: headerBg, borderBottom:`1px solid ${color}15`, userSelect:"none"
      }}>
        <span style={{ fontSize: mob?9:11, color, transition:"transform .15s", transform: open?"rotate(90deg)":"rotate(0)" }}>▶</span>
        <span style={{ fontSize: mob?14:16 }}>{folder.icon}</span>
        <span className="font-en" style={{ fontSize: mob?11:13, fontWeight:600, color }}>{folder.name}</span>
        <span style={{ marginLeft:"auto", fontSize: mob?9:10, color: darkMode ? "#94a3b8" : "#6b7280", background: darkMode ? "#f1f5f920" : "#f1f5f9", borderRadius:8, padding: mob?"1px 5px":"2px 6px", fontWeight:600 }}>{folder.sub.length}</span>
      </div>
      {open && <div style={{ padding: mob?"5px 0 6px":"6px 0 7px" }}>{folder.sub.map((s,i)=><SubItem key={i} name={s} mob={mob} darkMode={darkMode}/>)}</div>}
    </div>
  );
}

function ProcessTable({ list, mob, darkMode }) {
  const groups = useMemo(() => {
    const m = {};
    list.forEach(p => { (m[p.group] = m[p.group] || []).push(p); });
    return m;
  }, [list]);
  
  return (
    <div style={{ overflowX:"auto" }}>
      {Object.entries(groups).map(([grp, items]) => (
        <div key={grp} style={{ marginBottom: mob?10:14 }}>
          <div className="font-en" style={{ fontSize: mob?11:13, fontWeight:700, color: darkMode ? "#475569" : "#1f2937", textTransform:"uppercase", letterSpacing:0.5, padding: mob?"3px 0":"4px 0", borderBottom: darkMode ? "2px solid #e2e8f0" : "2px solid #d1d5db", marginBottom: mob?3:4 }}>{grp}</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize: mob?10:12 }}>
            <tbody>
              {items.map((p, i) => (
                <tr key={i} style={{ background: i%2===0 ? (darkMode ? "#f8fafc10" : "#f8fafc") : (darkMode ? "#fff05" : "#fff") }}>
                  <td className="font-en" style={{ padding: mob?"4px 6px":"5px 8px", fontWeight:700, color:"#2563eb", width: mob?50:65, whiteSpace:"nowrap", fontSize: mob?11:13 }}>{p.tag}</td>
                  <td className="font-en" style={{ padding: mob?"4px 6px":"5px 8px", color: darkMode ? "#e2e8f0" : "#1e293b", fontSize: mob?10:12 }}>{p.en}</td>
                  {!mob && <td className="font-fa" style={{ padding:"5px 8px", color: darkMode ? "#94a3b8" : "#64748b", direction:"rtl", textAlign:"right", fontSize:12 }}>{p.fa}</td>}
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
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function App() {
  const vw = useWindowSize();
  const mob = vw < 680;
  const tab = vw >= 680 && vw < 1100;
  const cols = mob ? 1 : tab ? 2 : 3;

  const [darkMode, setDarkMode] = useState(true);
  const [activeDept, setActiveDept] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("tree");

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

  // Theme colors
  const theme = darkMode ? {
    bg: "linear-gradient(150deg, #0d1117 0%, #161b22 45%, #1c2333 100%)",
    cardBg: "rgba(255,255,255,.055)",
    cardBorder: "rgba(255,255,255,.1)",
    textPrimary: "#e6edf3",
    textSecondary: "#8b949e",
    textMuted: "#6e7681",
    inputBg: "rgba(255,255,255,.08)",
    inputBorder: "rgba(255,255,255,.16)",
  } : {
    bg: "linear-gradient(150deg, #f0f9ff 0%, #e0f2fe 45%, #dbeafe 100%)",
    cardBg: "rgba(255,255,255,.8)",
    cardBorder: "rgba(0,0,0,.08)",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#64748b",
    inputBg: "rgba(255,255,255,.9)",
    inputBorder: "rgba(0,0,0,.1)",
  };

  return (
    <div style={{
      minHeight:"100vh", width:"100vw", boxSizing:"border-box", overflowX:"hidden",
      background: theme.bg,
      color: theme.textPrimary, 
      padding: mob?"14px 10px":"24px 24px",
      transition: "all 0.3s ease"
    }}>
      <style>{FONT_STYLES}</style>

      {/* ─── HEADER ─── */}
      <div style={{ width:"100%", textAlign:"center", marginBottom:5, position:"relative" }}>
        {/* Dark/Light Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            position:"absolute", 
            top:0, 
            right: mob?10:20, 
            background: theme.inputBg, 
            border:`1px solid ${theme.cardBorder}`, 
            borderRadius:"50%", 
            width: mob?32:38, 
            height: mob?32:38, 
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize: mob?16:18,
            transition:"all 0.3s"
          }}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="font-en" style={{ display:"inline-block", background: darkMode ? "rgba(134, 24, 43, 0.1)" : "rgba(239, 68, 68, 0.1)", border: darkMode ? "1px solid rgba(155, 114, 121, 0.28)" : "1px solid rgba(239,68,68,.3)", borderRadius:16, padding: mob?"4px 14px":"5px 18px", fontSize: mob?9:11, color: darkMode ? "#e94560" : "#dc2626", letterSpacing:1.8, textTransform:"uppercase", marginBottom:8 }}>
          Document Control Center — DCC
        </div>
        <h1 className="font-fa" style={{ margin:0, fontSize: mob?24:tab?32:38, fontWeight:800, lineHeight:1.2 }}>
          <span style={{ background: "", WebkitBackgroundClip:"text" }}>سپهر پاسارگاد</span>
        </h1>
        <p className="font-en" style={{ margin:"6px 0 0", fontSize: mob?11:14, color: theme.textSecondary, letterSpacing:0.4 }}>Sepehr Pasargad Oil & Gas — DCC Structure & Process Map</p>
      </div>

      {/* ─── STATS ROW ─── */}
      <div style={{ width:"100%", marginTop:16, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: mob?8:14 }}>
        {[
          { l:"DEPARTMENTS", v: DEPTS.length, i:"🏗️", c:"#e94560" },
          { l:"PROCESSES", v: PROCESSES.length, i:"🔖", c:"#3498db" },
          { l:"FOLDERS", v: totalFolders, i:"📁", c:"#2ecc71" },
        ].map((s,i)=>(
          <div key={i} style={{ background: theme.cardBg, border:`1px solid ${theme.cardBorder}`, borderRadius: mob?10:12, padding: mob?"14px 8px":"18px 12px", textAlign:"center", transition:"transform 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{ fontSize: mob?22:26 }}>{s.i}</div>
            <div className="font-en" style={{ fontSize: mob?26:34, fontWeight:800, color:s.c, marginTop:2, lineHeight:1 }}>{s.v}</div>
            <div className="font-en" style={{ fontSize: mob?8:10, color: theme.textMuted, textTransform:"uppercase", letterSpacing:1, marginTop:4, fontWeight:600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ─── DEPT PILLS ─── */}
      <div style={{ width:"100%", marginTop:16, display:"flex", flexWrap:"wrap", gap: mob?5:6, justifyContent:"center" }}>
        <button className="font-fa" onClick={()=>{ setActiveDept(null); setSearch(""); }} style={{
          padding: mob?"6px 14px":"7px 16px", borderRadius:16, border: !activeDept ? (darkMode ? "1.5px solid #e94560" : "1.5px solid #dc2626") : `1px solid ${theme.cardBorder}`,
          background: !activeDept ? (darkMode ? "rgba(233,69,96,.2)" : "rgba(220,38,38,.15)") : theme.inputBg,
          color: !activeDept ? (darkMode ? "#e94560" : "#dc2626") : theme.textSecondary, fontSize: mob?10:12, cursor:"pointer", fontWeight:700, transition:"all .15s"
        }}>همه</button>
        {DEPTS.map(d=>(
          <button className="font-fa" key={d.id} onClick={()=>{ setActiveDept(d.id); setSearch(""); }} style={{
            padding: mob?"6px 10px":"7px 12px", borderRadius:16, border: activeDept===d.id ? `1.5px solid ${d.color}` : `1px solid ${d.color}40`,
            background: activeDept===d.id ? `${d.color}28` : theme.inputBg,
            color: activeDept===d.id ? d.color : theme.textSecondary, fontSize: mob?10:11, cursor:"pointer", fontWeight:500, transition:"all .15s"
          }}>{d.icon} {d.fa}</button>
        ))}
      </div>

      {/* ─── SEARCH + VIEW TOGGLE ─── */}
      <div style={{ width:"100%", marginTop:14, display:"flex", gap: mob?6:8, alignItems:"center", flexWrap:"wrap" }}>
        <input className="font-fa" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 جستجو TAG یا فرآیند..."
          style={{ flex:"1 1 160px", minWidth:0, padding: mob?"9px 14px":"11px 16px", borderRadius:8, border:`1px solid ${theme.inputBorder}`, background: theme.inputBg, color: theme.textPrimary, fontSize: mob?11:13, outline:"none", transition:"all 0.2s" }}/>
        {["tree","processes"].map(v=>(
          <button className="font-en" key={v} onClick={()=>setView(v)} style={{
            padding: mob?"9px 14px":"11px 16px", borderRadius:8,
            border: view===v ? (darkMode ? "1.5px solid #e94560" : "1.5px solid #dc2626") : `1px solid ${theme.cardBorder}`,
            background: view===v ? (darkMode ? "rgba(233,69,96,.18)" : "rgba(220,38,38,.12)") : theme.inputBg,
            color: view===v ? (darkMode ? "#e94560" : "#dc2626") : theme.textSecondary, fontSize: mob?11:12, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap", transition:"all .15s"
          }}>{v==="tree"?"📁 Structure":"🔖 Processes"}</button>
        ))}
      </div>

      {/* ═══════════ MAIN PANEL ═══════════ */}
      <div style={{ width:"100%", marginTop:14 }}>

        {view === "tree" && (
          <>
            {/* ROOT BAR */}
            <div style={{ background: darkMode ? "linear-gradient(135deg,#1a1a2e,#16213e)" : "linear-gradient(135deg,#dbeafe,#bfdbfe)", border: darkMode ? "1px solid #e94560" : "1px solid #3b82f6", borderRadius:"10px 10px 0 0", padding: mob?"10px 14px":"13px 20px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize: mob?18:22 }}>🏢</span>
              <span className="font-en" style={{ fontSize: mob?16:20, fontWeight:700, color: darkMode ? "#fff" : "#1e3a8a" }}>SepehrPasargad_OG</span>
              <span className="font-en" style={{ fontSize: mob?9:11, color: darkMode ? "#e94560" : "#3b82f6", marginLeft:"auto", opacity:.85, fontWeight:600 }}>Root</span>
            </div>

            {/* SHARED + ARCHIVES */}
            <div style={{ background: darkMode ? "rgba(255,255,255,.035)" : "rgba(255,255,255,.7)", borderLeft: darkMode ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)", borderRight: darkMode ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)", padding: mob?"10px 14px 8px":"14px 20px 10px", display:"flex", gap: mob?16:28, flexWrap:"wrap" }}>
              {[
                { name:"Shared", icon:"🔗", sub:["Policies","Standards","Templates → Report_Templates | Form_Templates","Procedures → All_Department_Procedures","Training → Technical_Training | Safety_Training | Soft_Skills","Project_Engineering_Documents → P&ID | Isometric | Equipment_Layout | As_Built | Data_Sheet"] },
                { name:"Archives", icon:"📦", sub:["2024","2025 → Daily | Weekly | Monthly | Quarterly | Yearly | Other "]},
              ].map((f,i)=>(
                <div key={i} style={{ flex:"1 1 140px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <span style={{ fontSize: mob?16:18 }}>{f.icon}</span>
                    <span className="font-en" style={{ fontSize: mob?13:15, fontWeight:600, color: darkMode ? "#8b949e" : "#475569" }}>{f.name}</span>
                  </div>
                  {f.sub.map((s,j)=><SubItem key={j} name={s} mob={mob} darkMode={darkMode}/>)}
                </div>
              ))}
            </div>

            {/* DEPARTMENTS LABEL */}
            <div style={{ background: darkMode ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.85)", borderLeft: darkMode ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)", borderRight: darkMode ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)", padding: mob?"8px 14px":"10px 20px", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize: mob?18:22 }}>🏗️</span>
              <span className="font-en" style={{ fontSize: mob?14:18, fontWeight:700, color: darkMode ? "#c9d1d9" : "#1e293b" }}>Departments</span>
            </div>

            {/* DEPT GRID */}
            <div style={{
              background: darkMode ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.6)", border: darkMode ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)",
              borderRadius:"0 0 10px 10px", padding: mob?"10px 10px":"14px 14px",
              display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap: mob?8:12
            }}>
              {visibleDepts.map(d => {
                const folders = DEPT_FOLDERS[d.id] || [];
                const filtered = search
                  ? folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.sub.some(s => s.toLowerCase().includes(search.toLowerCase())))
                  : folders;
                return (
                  <div key={d.id} style={{ background: darkMode ? "#fff" : "#fff", borderRadius:10, border:`1.5px solid ${d.color}30`, overflow:"hidden", transition:"transform 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    {/* dept card header */}
                    <div style={{ background: darkMode ? `linear-gradient(135deg,${d.color}18,${d.color}08)` : `linear-gradient(135deg,${d.color}25,${d.color}12)`, padding: mob?"9px 10px":"10px 12px", display:"flex", alignItems:"center", gap: mob?6:8, borderBottom:`3px solid ${d.color}45` }}>
                      <span style={{ fontSize: mob?18:22 }}>{d.icon}</span>
                      <span className="font-en" style={{ fontSize: mob?11:14, fontWeight:700, color:d.color }}>{d.id}</span>
                      <span className="font-fa" style={{ fontSize: mob?9:11, color:d.color, marginLeft:"auto", background:`${d.color}16`, borderRadius:8, padding: mob?"1px 5px":"2px 7px", fontWeight:500 }}>{d.fa}</span>
                    </div>
                    {/* folder cards inside */}
                    <div style={{ padding: mob?"6px 4px 5px":"8px 5px 6px" }}>
                      {filtered.map((f,i) => <FolderCard key={i} folder={f} color={d.color} mob={mob} darkMode={darkMode}/>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ─── PROCESSES VIEW ─── */}
        {view === "processes" && (
          <div style={{ background: darkMode ? "rgba(255,255,255,.035)" : "rgba(255,255,255,.8)", border: darkMode ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.08)", borderRadius:10, overflow:"hidden" }}>
            <div style={{ background: darkMode ? "linear-gradient(135deg,#1a1a2e,#16213e)" : "linear-gradient(135deg,#dbeafe,#bfdbfe)", padding: mob?"10px 14px":"13px 20px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <span style={{ fontSize: mob?18:22 }}>🔖</span>
              <span className="font-en" style={{ fontSize: mob?13:16, fontWeight:700, color: darkMode ? "#fff" : "#1e3a8a" }}>
                {dept ? `${dept.icon} ${dept.id}` : "All Processes"}
              </span>
              <span className="font-en" style={{ fontSize: mob?10:12, color: darkMode ? "#8b949e" : "#64748b", marginLeft:"auto", fontWeight:500 }}>{filteredProcesses.length} processes</span>
            </div>
            <div style={{ padding: mob?12:18, background: darkMode ? "#0d1117" : "#fff", color: darkMode ? "#e6edf3" : "#2d3748" }}>
              <ProcessTable list={filteredProcesses} mob={mob} darkMode={darkMode}/>
            </div>
          </div>
        )}
      </div>

      {/* ─── LEGEND ─── */}
      <div style={{ width:"100%", marginTop:20, display:"flex", gap: mob?12:20, flexWrap:"wrap", justifyContent:"center" }}>
        {[
          { i:"📁", l:"Folder", c:"#3498db" },
          { i:"📊", l:"Reports", c:"#e74c3c" },
          { i:"🗃️", l:"Records", c:"#27ae60" },
          { i:"🔒", l:"Restricted", c:"#ef4444" },
          { i:"🔖", l:"TAG", c:"#2563eb" },
        ].map((l,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:4, fontSize: mob?11:13, color: theme.textMuted }}>
            <span style={{ fontSize: mob?13:15 }}>{l.i}</span><span className="font-en" style={{ color:l.c, fontWeight:600 }}>{l.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}