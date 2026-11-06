import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// The names below are an allowlist of directories in this repository. The
// question is used only for topic selection; it can never become a file path.
const ROUTES = [
  ['monthly-report-review', /(?:review.{0,40}(?:whole|entire|full|complete).{0,30}(?:report|workbook|file)|(?:whole|entire|full|complete).{0,30}(?:report|workbook|file).{0,30}review|monthly.{0,20}report.{0,25}review|report.{0,25}(?:html|build).{0,25}review|\u8986\u6838.{0,8}\u6574\u4efd(?:\u5831\u544a|\u6708\u5831)|\u6aa2\u67e5.{0,8}\u6574\u4efd(?:\u5831\u544a|\u6708\u5831)|\u6574\u4efd\u5831\u544a|\u5168\u4efd\u5831\u544a|\u5831\u544a\u8986\u6838|\u6708\u5831\u8986\u6838|\u5168\u5831\u8868\u6aa2\u67e5)/i],
  ['general-learning', /(?:\b(?:learn|learning|teach(?:\s+me)?|teaching|tutor(?:ial)?|primer|refresher|walk(?:\s|-)?me\s+through|explain|explanation|help\s+me\s+understand|overview\s+of|intro(?:duction)?\s+to)\b|\u5b78\u7fd2|\u6559\u5b78|\u6559\u6211|\u89e3\u91cb|\u8aaa\u660e|\u5165\u9580|\u6982\u8ff0|\u5e6b\u6211\u7406\u89e3)/i],
  ['hkfrs-18', /(?:hkfrs|ifrs)\s*[- ]?18\b|財務報表(?:列報|呈列).*披露/i],
  ['automated-reconciliation', /reconcil|bank rec|intercompany match|對帳|銀行調節|往來核對/i],
  ['close-management', /month[ -]?end|period[ -]?end|year[ -]?end|close checklist|closing process|月結|年結|結帳流程/i],
  ['journal-entry', /journal|debit|credit|accrual|prepay|分錄|借貸|應計|預付/i],
  ['statement-preparation', /financial statement|balance sheet|trial balance|cash flow statement|財務報表|資產負債表|試算表|現金流量表/i],
  ['financial-analysis', /ratio|variance|margin|profitability|financial analy|財務分析|比率|差異分析/i],
  ['budget-forecast', /budget|forecast|預算|預測/i],
  ['inventory-costing', /inventor|stock cost|fifo|weighted average|存貨|先進先出|加權平均/i],
  ['fixed-asset-accounting', /fixed asset|depreciation|impairment|capitali[sz]|固定資產|折舊|減值|資本化/i],
  ['corporate-consolidation', /consolidat|subsidiar|elimination|合併報表|附屬公司|抵銷/i],
  ['revenue-recognition', /revenue recognition|hkfrs\s*15|ifrs\s*15|收入確認/i],
  ['lease-accounting', /\blease(?:s| accounting)?\b|right.of.use|hkfrs\s*16|ifrs\s*16|租賃|使用權資產/i],
  ['ecl-computation', /expected credit loss|\becl\b|hkfrs\s*9|ifrs\s*9|預期信貸損失/i],
  ['deferred-tax', /deferred tax|暫時性差異|遞延稅/i],
  ['profits-tax', /profits tax|利得稅/i],
  ['salaries-tax', /salaries tax|薪俸稅/i],
  ['tax-planning', /tax planning|tax strateg|稅務規劃/i],
  ['working-capital-analysis', /working capital|\bdso\b|\bdpo\b|\bdio\b|營運資金/i],
  ['treasury-management', /treasury|liquidity|cash forecast|資金管理|流動資金/i],
  ['risk-assessment', /risk assessment|risk map|風險評估/i],
  ['audit-checklist', /audit checklist|audit procedure|審計清單|審計程序/i],
  ['internal-audit', /internal audit|內部審計|內部稽核/i],
];

export function selectFinanceSkills(question, maxSkills = 2) {
  const text = String(question || '').slice(0, 4000);
  const selected = ROUTES.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
  return selected.slice(0, Math.max(0, Math.min(3, maxSkills)));
}

export function buildFinanceSkillContext(question, { root, maxChars = 12000 } = {}) {
  if (!root) throw new Error('Finance skills root is required');
  const selected = ['qwen-chat-assistant', ...selectFinanceSkills(question)];
  const sections = [];
  const used = [];
  let remaining = Math.min(Math.max(0, maxChars), 16000);

  for (const id of selected) {
    const file = path.join(root, id, 'SKILL.md');
    let content;
    try {
      if (statSync(file).size > 64 * 1024) continue;
      content = readFileSync(file, 'utf8').trim();
    } catch { continue; }
    if (!content || remaining < 500) continue;
    const excerpt = content.slice(0, Math.min(remaining, 8000));
    sections.push(`SOURCE: hk-finance-skills/${id}/SKILL.md\n${excerpt}`);
    used.push(id);
    remaining -= excerpt.length;
  }

  if (!sections.length) return { selected: [], text: '' };
  return {
    selected: used,
    text: 'LOCAL QWEN ASSISTANT BEHAVIOR AND FINANCE REFERENCES:\n' +
      'Follow the common assistant behavior guidance on every turn and use topic-specific finance references when relevant. ' +
      'These references do not grant permission to change data or approve accounting treatment. ' +
      'Distinguish general guidance from company-specific facts. Do not announce internal skill names; cite an official standards link when useful and available. ' +
      'If a source does not establish a current requirement, say what needs verification.\n\n' +
      sections.join('\n\n---\n\n')
  };
}
