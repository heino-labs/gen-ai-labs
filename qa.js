const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, VerticalAlign
} = require('docx');
const fs = require('fs');

// ===== COLOR PALETTE =====
const COLOR = {
  primary: "1A4C8A",       // deep blue - headings
  accent: "2E75B6",        // mid blue - h2
  light: "E8F0FA",         // light blue - table headers
  boxBg: "F5F8FE",         // very light blue - info boxes
  good: "E6F4EA",          // green - good examples
  bad: "FDECEA",           // red - bad examples
  warn: "FFF8E1",          // yellow - warnings
  border: "CCCCCC",
  textDark: "1A1A1A",
  textMid: "333333",
  white: "FFFFFF",
  gray: "555555",
};

// ===== NUMBERING CONFIG =====
const NUMBERING = {
  config: [
    {
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }, {
        level: 1, format: LevelFormat.BULLET, text: "-",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
      }]
    },
    {
      reference: "numbers",
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    },
    {
      reference: "checks",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u25A1",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }
  ]
};

// ===== HELPERS =====
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color: COLOR.primary })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.accent, space: 2 } },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: COLOR.accent })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: COLOR.primary })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [new TextRun({
      text, font: "Arial", size: 22,
      color: opts.color || COLOR.textMid,
      bold: opts.bold || false,
      italics: opts.italic || false,
    })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: COLOR.textMid })]
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: COLOR.textMid })]
  });
}

function check(text) {
  return new Paragraph({
    numbering: { reference: "checks", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: COLOR.textMid })]
  });
}

function gap(size = 120) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun("")] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function sectionLabel(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color: COLOR.gray, allCaps: true })]
  });
}

function infoBox(title, lines, bgColor = COLOR.boxBg) {
  const bdr = { style: BorderStyle.SINGLE, size: 1, color: COLOR.border };
  const children = [];
  if (title) children.push(new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, font: "Arial", size: 22, bold: true, color: COLOR.primary })]
  }));
  for (const line of lines) {
    children.push(new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: line, font: "Arial", size: 21, color: COLOR.textMid })]
    }));
  }
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 180, right: 180 },
        width: { size: 9026, type: WidthType.DXA },
        children
      })]
    })]
  });
}

function twoColBox(leftTitle, leftLines, rightTitle, rightLines, leftColor = COLOR.bad, rightColor = COLOR.good) {
  const bdr = { style: BorderStyle.SINGLE, size: 1, color: COLOR.border };

  function makeCell(title, lines, bg) {
    const children = [new Paragraph({
      spacing: { before: 60, after: 80 },
      children: [new TextRun({ text: title, font: "Arial", size: 22, bold: true, color: COLOR.primary })]
    })];
    for (const l of lines) {
      children.push(new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: l, font: "Arial", size: 20, color: COLOR.textMid, italics: l.startsWith('"') })]
      }));
    }
    return new TableCell({
      borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      width: { size: 4420, type: WidthType.DXA },
      children
    });
  }

  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [4420, 4420],
    rows: [new TableRow({
      children: [
        makeCell(leftTitle, leftLines, leftColor),
        makeCell(rightTitle, rightLines, rightColor)
      ]
    })]
  });
}

function headerRow(cols, widths) {
  const bdr = { style: BorderStyle.SINGLE, size: 1, color: COLOR.border };
  return new TableRow({
    tableHeader: true,
    children: cols.map((col, i) => new TableCell({
      borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
      shading: { fill: COLOR.light, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      width: { size: widths[i], type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        children: [new TextRun({ text: col, font: "Arial", size: 20, bold: true, color: COLOR.primary })]
      })]
    }))
  });
}

function dataRow(cells, widths, bg = COLOR.white) {
  const bdr = { style: BorderStyle.SINGLE, size: 1, color: COLOR.border };
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders: { top: bdr, bottom: bdr, left: bdr, right: bdr },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      width: { size: widths[i], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text, font: "Arial", size: 20, color: COLOR.textMid })]
      })]
    }))
  });
}

// ===== COVER PAGE =====
function coverPage() {
  return [
    gap(1200),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: "CAM NANG", font: "Arial", size: 20, color: COLOR.gray, allCaps: true, characterSpacing: 200 })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: "TU DUY PHAN TICH", font: "Arial", size: 52, bold: true, color: COLOR.primary })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: "VA KY THUAT VIET QA", font: "Arial", size: 52, bold: true, color: COLOR.primary })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 400 },
      children: [new TextRun({ text: "Chuyen Nghiep Trong Du An Phan Mem Nhat Ban", font: "Arial", size: 28, color: COLOR.accent, italics: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.accent } },
      spacing: { before: 0, after: 400 },
      children: [new TextRun({ text: " " })]
    }),
    gap(400),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: "Danh cho: Developer | Senior Dev | BA | SA | BrSE | Team Leader", font: "Arial", size: 22, color: COLOR.gray })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: "Phien ban 1.0", font: "Arial", size: 22, color: COLOR.gray })]
    }),
    pageBreak()
  ];
}

// ===== PREFACE =====
function preface() {
  return [
    h1("LOI NOI DAU"),
    body("Trong cac du an phan mem Nhat Ban, Q&A (Question & Answer / Clarification) la mot trong nhung hoat dong quan trong nhat nhung cung la hoat dong bi hieu sai nhieu nhat."),
    gap(),
    body("Nhieu nguoi cho rang QA don gian la viec dat cau hoi khi gap noi dung chua ro."),
    gap(),
    body("Thuc te khong phai vay.", { bold: true }),
    gap(),
    body("Mot QA chat luong khong duoc danh gia boi so luong cau hoi duoc tao ra."),
    gap(),
    body("Mot QA chat luong duoc danh gia boi:"),
    bullet("Kha nang phat hien van de."),
    bullet("Chat luong phan tich."),
    bullet("Muc do hieu nghiep vu."),
    bullet("Kha nang danh gia tac dong."),
    bullet("Kha nang de xuat giai phap."),
    bullet("Kha nang giup nguoi nhan dua ra quyet dinh nhanh chong."),
    gap(),
    body("Trong cac du an Nhat Ban, khach hang khong ky vong doi phat trien chi dat cau hoi. Khach hang ky vong doi phat trien chu dong phan tich, dua ra nhan thuc hien tai, de xuat phuong an xu ly va chi yeu cau xac nhan doi voi cac noi dung thuc su can quyet dinh."),
    gap(),
    infoBox("Luan diem cot loi", [
      "QA khong phai la ky nang dat cau hoi.",
      "QA la ket qua cua qua trinh tu duy phan tich.",
      "Nguoi moi gui cau hoi. Nguoi co kinh nghiem gui nhan thuc. System Analyst gui giai phap va yeu cau xac nhan."
    ], COLOR.light),
    pageBreak()
  ];
}

// ===== PART 1 =====
function part1() {
  return [
    h1("PHAN 1: BAN CHAT CUA QA"),
    h2("1.1 QA La Gi? QA Khong Phai La Gi?"),
    body("Hieu lam pho bien nhat ma moi nguoi mac phai:"),
    gap(60),
    infoBox("Hieu lam:", ['"Toi khong biet nen toi hoi."', "=> Day la cach tiep can cua nguoi moi vao nghe."]),
    gap(),
    body("Trong thuc te du an, dac biet la du an Nhat Ban, QA co y nghia gan voi:"),
    gap(60),
    infoBox("Dinh nghia dung:", [
      "Clarification - Lam ro",
      "Decision Support - Ho tro quyet dinh",
      "",
      '"Toi da nghien cuu, da phan tich va da xay dung nhan thuc hien tai.',
      'Toi can xac nhan de dua ra quyet dinh chinh xac."'
    ], COLOR.good),
    gap(),
    h3("QA la gi?"),
    bullet("La hoat dong lam ro yeu cau hoac thiet ke."),
    bullet("La cong cu ghi nhan quyet dinh cua du an."),
    bullet("La ket qua cua qua trinh doc tai lieu, phan tich va danh gia tac dong."),
    bullet("La buoc cuoi cung, sau khi da tu minh tim hieu het kha nang co the."),
    gap(),
    h3("QA khong phai la gi?"),
    bullet("Khong phai la cach de hoi thay cho viec doc tai lieu."),
    bullet("Khong phai la cach de chuyen trach nhiem phan tich sang khach hang."),
    bullet("Khong phai la the hien su thieu kinh nghiem."),
    bullet("Khong phai la cau hoi 'Cai nay lam nhu the nao?'"),
    gap(),
    h2("1.2 Vi Sao QA Quan Trong?"),
    body("Trong mo hinh phat trien phan mem Nhat Ban, tai lieu thuong rat day du nhung khong bao gio co the mo ta 100% cac truong hop. Gap trong tai lieu la dieu binh thuong, khong phai ngoai le."),
    gap(),
    body("QA chinh xac giup du an:"),
    bullet("Tranh hieu sai dan den rework ton kem."),
    bullet("Ghi nhan quyet dinh de tranh tranh chap sau nay."),
    bullet("The hien nang luc phan tich cua doi phat trien."),
    bullet("Xay dung niem tin voi khach hang Nhat."),
    gap(),
    h2("1.3 Chi Phi Cua QA Chat Luong Thap"),
    body("Nhieu nguoi nghi rang QA 'mien phi' - chi mat vai phut de viet. Day la suy nghi sai."),
    gap(),
    body("Hay xem xet mot tinh huong thuc te:"),
    gap(60),
    infoBox("Tinh huong: Du an quan ly nhan su", [
      "Developer A viet QA: 'Truong hop xoa nhan vien thi lam nhu the nao?'",
      "",
      "Khach hang nhan QA nay phai:",
      "- Hieu A dang hoi ve truong hop nao (xoa co dinh? nghi viec? gian chenh?)",
      "- Tim lai tai lieu de xem da co mo ta chua",
      "- Ho hop noi bo de quyet dinh",
      "- Viet lai phan hoi chi tiet",
      "",
      "Tong thoi gian khach hang mat: 2-3 gio",
      "",
      "Neu A da phan tich truoc va viet QA chat luong cao, khach hang chi can 5 phut de confirm."
    ]),
    gap(),
    body("Nhan boi so nay voi 50-100 QA trong mot du an, ban se hieu vi sao QA chat luong thap tao ra su mat man va ton kem cho ca hai phia.", { italic: true }),
    pageBreak()
  ];
}

// ===== PART 2 =====
function part2() {
  return [
    h1("PHAN 2: TU DUY THEO CAP DO"),
    body("Day la phan rat quan trong ma nhieu tai lieu dao tao bo qua: Tu duy viet QA khac nhau theo tung cap do kinh nghiem."),
    gap(),
    h2("2.1 Junior Developer"),
    h3("Cach nhin van de"),
    body("Junior nhin code va nhin tai lieu theo huong: 'Cai nay toi khong biet.'"),
    gap(),
    h3("Cach dat cau hoi"),
    twoColBox(
      "Junior viet the nay (chua tot)",
      ['"Truong hop nhap sai email thi xu ly nhu the nao?"', '"API nay tra ve gi?"', '"Cot nay trong DB co y nghia gi?"'],
      "Van de o cho nao",
      ["Chua doc tai lieu.", "Chua tu tim hieu.", "Chuyen toan bo trach nhiem sang khach hang."]
    ),
    gap(),
    h3("Dau hieu nhan biet"),
    bullet("QA ngan, thieu context."),
    bullet("Khong co phan tich, khong co de xuat."),
    bullet("Nhieu cau hoi co the tu tra loi bang cach doc tai lieu them."),
    gap(),
    h2("2.2 Middle Developer"),
    h3("Cach nhin van de"),
    body("Middle da doc tai lieu truoc khi hoi. Nhung dung lai o muc: 'Tai lieu noi X, toi hieu Y, dung khong?'"),
    gap(),
    twoColBox(
      "Middle viet the nay",
      ['"Theo DD trang 12, field status co 3 gia tri: 0, 1, 2.',
       'Nhung Mockup hien thi 4 trang thai.',
       'Nhu vay co them trang thai thu 4 khong?"'],
      "Cai thien so voi Junior",
      ["Co dan chung cu the.", "Co nguon tai lieu tham chieu.", "Cau hoi ro rang hon."]
    ),
    gap(),
    body("Tuy nhien van chua co phan tich tac dong va chua co de xuat xu ly. Khach hang van phai tu suy nghi 'Nen lam the nao bay gio?'"),
    gap(),
    h2("2.3 Senior Developer"),
    h3("Cach nhin van de"),
    body("Senior khong chi doc tai lieu ma con cross-check giua cac nguon tai lieu voi nhau va phan tich tac dong cu the."),
    gap(),
    twoColBox(
      "Senior viet the nay",
      ['"Phat hien mau thuan: DD mo ta 3 trang thai, Mockup hien thi 4.',
       'Neu thieu trang thai thu 4, xu ly duyet se bi thieu.',
       'De xuat: Them trang thai PENDING_APPROVAL vao DD.',
       'Nho confirm."'],
      "Kha nang vuot troi",
      ["Phat hien GAP ro rang.", "Phan tich impact cu the.", "Co de xuat giai phap.", "Khach hang chi can Yes/No."]
    ),
    gap(),
    h2("2.4 Business Analyst (BA)"),
    h3("Cach nhin van de"),
    body("BA nhin van de tu goc do nghiep vu, khong chi tu goc do ky thuat. BA dat cau hoi: 'Nguoi dung se cam thay nhu the nao trong tinh huong nay?'"),
    gap(),
    twoColBox(
      "BA viet the nay",
      ['"Luong duyet: Khi NV gui don nghi phep, NV khong biet don dang o buoc nao.',
       'Mockup chua co man hinh xem lich su duyet.',
       'De xuat: Them man hinh tracking don.',
       'Neu khong the, can co email thong bao khi trang thai thay doi.',
       'Nho confirm phuong an uu tien."'],
      "Diem manh cua BA",
      ["Nhin tu goc nhin nguoi dung.", "Phan tich toan bo luong nghiep vu.", "De xuat nhieu phuong an de khach hang chon.", "Bao gom ca UX consideration."]
    ),
    gap(),
    h2("2.5 System Analyst (SA)"),
    h3("Cach nhin van de"),
    body("SA la cap do cao nhat trong viec viet QA. SA nhin toan bo he thong, danh gia tac dong len architecture va dua ra giai phap tong the."),
    gap(),
    infoBox("SA viet the nay", [
      "Van de: Approval workflow chua mo ta ro logic.",
      "",
      "Phan tich:",
      "1. DD hien chi mo ta happy path (flow chinh).",
      "2. Exception flows (reject, recall, timeout) chua duoc dinh nghia.",
      "3. Audit log requirements cho luong duyet chua ro.",
      "4. Neu implement theo DD hien tai, sau nay se can refactor lon.",
      "",
      "Tac dong:",
      "- Thiet ke DB co the phai thay doi neu co them trang thai.",
      "- API contract se bi breaking change.",
      "- Test case hien tai chua phu du truong hop.",
      "",
      "Kien nghi:",
      "Option A: Bo sung day du exception flow truoc khi implement (khuyen nghi).",
      "Option B: Implement happy path truoc, mo ta exception sau - co rui ro refactor.",
      "",
      "Nho confirm phuong an.",
    ], COLOR.good),
    gap(),
    body("Day la su khac biet co ban giua cac cap do. SA khong hoi - SA de xuat va yeu cau xac nhan.", { bold: true }),
    pageBreak()
  ];
}

// ===== PART 3 =====
function part3() {
  return [
    h1("PHAN 3: CACH DOC TAI LIEU DE TIM QA"),
    body("Doc tai lieu de tim QA khac voi doc tai lieu de hieu yeu cau. Day la ky nang can duoc ren luyen co chu dich."),
    gap(),
    h2("3.1 Doc Requirement (BD - Business Design)"),
    h3("Doc de tim gi?"),
    bullet("Ai la nguoi dung? (Actor)"),
    bullet("Muc tieu cua chuc nang la gi?"),
    bullet("Cac truong hop su dung (use case) da du chua?"),
    bullet("Business rule co ro rang khong?"),
    bullet("Exception case co duoc mo ta khong?"),
    gap(),
    h3("Dau hieu co GAP trong Requirement"),
    infoBox("Cac dau hieu can dung lai phan tich:", [
      '- Ngon ngu mo ho: "Hien thi thong tin phu hop", "xu ly theo quy dinh"',
      '- Thieu actor: Ai duoc lam gi? Ai khong duoc lam gi?',
      '- Thieu dieu kien: Khi nao thi X? Khi nao thi Y?',
      '- Thieu exception: Neu nguoi dung lam sai thi sao?',
      '- Thieu business rule: Gia tri hop le la gi?',
    ]),
    gap(),
    h3("Vi du thuc te"),
    twoColBox(
      "Requirement viet: (mo ho)",
      ['"He thong cho phep nguoi dung quan ly don hang."'],
      "QA can tao",
      ['"Quan ly" bao gom nhung thao tac nao? (Tao/Su/Xoa/Xem?)',
       "Ai co quyen 'quan ly'? Tat ca user hay chi Admin?",
       "Don hang da hoan thanh co xoa duoc khong?",
       "Xoa la soft delete hay hard delete?"]
    ),
    gap(),
    h2("3.2 Doc Detail Design (DD)"),
    h3("Doc de tim gi?"),
    bullet("Logic xu ly co day du khong?"),
    bullet("Mapping giua input va output co ro khong?"),
    bullet("Validation rules co duoc liet ke day du khong?"),
    bullet("Error handling co duoc mo ta khong?"),
    bullet("Permission co duoc dinh nghia ro khong?"),
    gap(),
    h3("Dau hieu co GAP trong DD"),
    infoBox("Cac dau hieu:", [
      '- Field duoc su dung trong xu ly nhung khong co trong DB',
      '- Validation tren Mockup nhung khong co trong DD',
      '- Flow mo ta nhung thieu buoc xu ly',
      '- Mo ta xu ly nhung khong co error handling',
      '- Permission duoc de cap nhung chua dinh nghia dieu kien',
    ]),
    gap(),
    h2("3.3 Doc Database Design (DB)"),
    h3("Doc de tim gi?"),
    bullet("Tat ca field ma DD mo ta co ton tai trong DB khong?"),
    bullet("Kieu du lieu co khop voi xu ly khong?"),
    bullet("Constraint co phu hop voi business rule khong?"),
    bullet("Relation giua cac bang co ro khong?"),
    bullet("Index co duoc thiet ke cho cac truong hop query khong?"),
    gap(),
    h3("Vi du GAP DB thuong gap"),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [3000, 3000, 3026],
      rows: [
        headerRow(["Trong DD", "Trong DB", "Van de"], [3000, 3000, 3026]),
        dataRow(["Hien thi ten phong ban", "Bang m_department khong co cot name", "Thieu column - can biet co them hay thieu DD?"], [3000, 3000, 3026], COLOR.bad),
        dataRow(["So dien thoai dang so", "Kieu VARCHAR(10)", "So co am / dau gach / chuyen so quoc te?"], [3000, 3000, 3026]),
        dataRow(["Ghi log khi xoa", "Khong co bang log", "Thieu bang audit log"], [3000, 3000, 3026], COLOR.bad),
        dataRow(["Soft delete", "Khong co cot is_deleted", "Thieu flag xoa mem"], [3000, 3000, 3026]),
      ]
    }),
    gap(),
    h2("3.4 Doc Mockup / Screen Design"),
    h3("Doc de tim gi?"),
    bullet("Trang thai hien thi co tuong ung voi du lieu khong?"),
    bullet("Button / action co tuong ung voi permission khong?"),
    bullet("Validation tren man hinh co tuong ung voi DD khong?"),
    bullet("Empty state co duoc thiet ke khong?"),
    bullet("Responsive / mobile co duoc xem xet khong?"),
    gap(),
    h3("Dau hieu co GAP trong Mockup"),
    infoBox("Cac truong hop can dung lai:", [
      '- Mockup co dau * (required) nhung DD khong co validation',
      '- Button hien thi nhung DD khong mo ta khi nao disabled',
      '- Dropdown co option nhung DB khong co table tuong ung',
      '- So luong cot hien thi khong khop voi field trong DB',
      '- Co pagination nhung DD khong mo ta so ban ghi mac dinh',
    ]),
    gap(),
    h2("3.5 Doc API Design"),
    h3("Doc de tim gi?"),
    bullet("Request/Response contract co khop voi DD khong?"),
    bullet("HTTP method co phu hop voi chuc nang khong?"),
    bullet("Error code co day du khong?"),
    bullet("Authentication va Authorization co duoc mo ta khong?"),
    bullet("Rate limiting hoac constraint khac co duoc xem xet khong?"),
    gap(),
    h2("3.6 Cross-Check - Buoc Quan Trong Nhat"),
    body("Sau khi doc tung loai tai lieu, buoc quan trong nhat la cross-check: tim diem khong khop giua cac nguon."),
    gap(),
    infoBox("Ma tran cross-check", [
      "Requirement <-> BD: Business rule co nhat quan khong?",
      "BD <-> DD: Logic nghiep vu co duoc the hien du trong thiet ke?",
      "DD <-> DB: Xu ly co the thuc hien duoc voi cau truc DB hien tai?",
      "DD <-> Mockup: Man hinh co hien thi dung cac trang thai duoc mo ta?",
      "DD <-> API: Contract co nhat quan giua frontend va backend?",
      "DB <-> API: Du lieu tra ve co dung kieu, dung cau truc?",
    ]),
    pageBreak()
  ];
}

// ===== PART 4 =====
function part4() {
  return [
    h1("PHAN 4: TU DUY PHAT HIEN GAP"),
    body("GAP la khoang cach giua nhung gi tai lieu mo ta va nhung gi can thiet de implement chinh xac. Tim GAP la ky nang tong hop, khong phai chi doc tai lieu."),
    gap(),
    h2("4.1 Requirement Gap"),
    body("Loai GAP phat sinh khi yeu cau khong du ro de implement."),
    gap(),
    h3("Dau hieu"),
    bullet("Yeu cau dung cac tu nhu: 'phu hop', 'can thiet', 'theo quy dinh'."),
    bullet("Yeu cau chua mo ta exception case."),
    bullet("Yeu cau chua dinh nghia permission cu the."),
    bullet("Yeu cau mo ta 'what' nhung khong ro 'when' va 'who'."),
    gap(),
    h3("Vi du thuc te - He thong quan ly don hang"),
    twoColBox(
      "Requirement ban dau",
      ['"Nguoi dung co the huy don hang."'],
      "Requirement Gap can xu ly",
      [
        "Khi nao co the huy? (Truoc xac nhan? Dang van chuyen?)",
        "Ai co quyen huy? (Nguoi dat? Admin? Ca hai?)",
        "Co gioi han so lan huy khong?",
        "Khi huy, tien co duoc hoan lai khong?",
        "Thong bao cho ai khi huy?",
        "Can nhap ly do huy khong?"
      ]
    ),
    gap(),
    h2("4.2 Design Gap"),
    body("Loai GAP phat sinh khi thiet ke ky thuat chua du de implement."),
    gap(),
    h3("Vi du - He thong tinh luong"),
    infoBox("Tinh huong thuc te", [
      "DD mo ta: Luong = Luong co ban + Phu cap - Khau tru",
      "",
      "Design Gap phat hien:",
      "1. 'Phu cap' la phu cap gi? Mo ta chua co bang phu cap.",
      "2. 'Khau tru' theo cong thuc nao? BHXH, thue TNCN co phan biet khong?",
      "3. Thoi diem tinh luong la khi nao? Cuoi thang hay cu dinh ky?",
      "4. Neu NV nghi giua thang, tinh pro-rata nhu the nao?",
      "5. Table nao luu ket qua tinh luong? Chua co trong DB.",
    ]),
    gap(),
    h2("4.3 UI Gap"),
    body("Loai GAP phat sinh khi man hinh khong mo ta day du cac trang thai hoac hanh vi."),
    gap(),
    h3("Cac UI Gap pho bien"),
    bullet("Empty state: Man hinh hien thi gi khi chua co du lieu?"),
    bullet("Loading state: Co hien thi loading spinner khong?"),
    bullet("Error state: Man hinh hien thi gi khi co loi?"),
    bullet("Permission state: Man hinh hien thi gi khi khong co quyen?"),
    bullet("Responsive: Tren mobile hien thi nhu the nao?"),
    gap(),
    h3("Vi du thuc te - Man hinh danh sach"),
    twoColBox(
      "Mockup chi hien thi (hien thi duoc)",
      [
        "Danh sach du lieu day du",
        "Phan trang (page 1 of N)",
        "Button them moi"
      ],
      "Cac trang thai chua duoc mo ta",
      [
        "Khi list trong (new tenant)?",
        "Khi dang tai du lieu?",
        "Khi co loi tu API?",
        "Khi user khong co quyen them?",
        "Khi search khong co ket qua?"
      ]
    ),
    gap(),
    h2("4.4 DB Gap"),
    body("Loai GAP phat sinh khi cau truc du lieu khong du de luu tru va xu ly thong tin."),
    gap(),
    h3("DB Gap pho bien nhat"),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [2500, 3000, 3526],
      rows: [
        headerRow(["Tinh huong", "Van de", "Cau hoi QA"], [2500, 3000, 3526]),
        dataRow(["Soft delete", "Khong co cot deleted_at hoac is_deleted", "Hard delete hay soft delete? Can them column?"], [2500, 3000, 3526]),
        dataRow(["Audit log", "Khong co bang log thao tac", "Ai yeu cau audit? Luu fields nao?"], [2500, 3000, 3526]),
        dataRow(["Multi-language", "Chi co cot name (tieng Nhat)", "Co can luu ten tieng Anh khong?"], [2500, 3000, 3526]),
        dataRow(["History", "Khong co bang luu lich su thay doi", "Can giu lich su hay chi trang thai hien tai?"], [2500, 3000, 3526]),
      ]
    }),
    gap(),
    h2("4.5 Technical Gap"),
    body("Loai GAP phat sinh khi thiet ke ky thuat khong kha thi voi moi truong hien tai."),
    gap(),
    infoBox("Vi du - Import CSV 500,000 dong", [
      "DD mo ta: 'He thong hien thi ket qua import ngay lap tuc sau khi upload.'",
      "",
      "Technical Gap:",
      "- Xu ly 500,000 dong dong bo se timeout (gioi han HTTP thuong la 30-60 giay).",
      "- Neu xu ly bat dong bo, DD chua mo ta trang thai 'dang xu ly'.",
      "- Neu co loi o dong 300,000, xu ly the nao? Rollback toan bo hay luu phan thanh cong?",
      "- Memory limit tren server co chiu duoc 500,000 dong du lieu?",
      "",
      "Day la truong hop Technical Gap anh huong ca Architecture."
    ]),
    gap(),
    h2("4.6 Process Gap"),
    body("Loai GAP phat sinh khi quy trinh nghiep vu chua duoc dinh nghia ro."),
    gap(),
    infoBox("Vi du - Quy trinh duyet nghiem thu", [
      "BD mo ta: 'Sau khi dev hoan thanh, TL duyet va gui khach hang.'",
      "",
      "Process Gap:",
      "- Ai la TL trong truong hop TL nghi phep?",
      "- TL duyet o dau? (Email? He thong? Ca hai?)",
      "- Deadline duyet la bao lau?",
      "- Khi khach hang tu choi, co huy qua ve dev khong?",
      "- Lich su duyet duoc luu nhu the nao?",
      "- Co can chu ky dien tu khong?"
    ]),
    pageBreak()
  ];
}

// ===== PART 5 =====
function part5() {
  return [
    h1("PHAN 5: FRAMEWORK VIET QA CHUYEN NGHIEP"),
    body("Sau khi tim ra GAP, buoc tiep theo la viet QA. Framework COAUPC giup cau truc hoa mot QA chat luong cao."),
    gap(),
    infoBox("Framework COAUPC", [
      "C - Context      : Mo ta hien trang",
      "O - Observation  : Neu diem bat thuong",
      "A - Analysis     : Phan tich tac dong",
      "U - Understanding: Mo ta nhan thuc hien tai",
      "P - Proposal     : De xuat phuong an",
      "C - Confirmation : Noi dung can xac nhan",
    ], COLOR.light),
    gap(),
    h2("5.1 C - Context (Hien Trang)"),
    body("Muc dich: Giup nguoi doc biet ngay ban dang noi ve man hinh, chuc nang, hoac tai lieu nao."),
    gap(),
    h3("Cach viet"),
    bullet("Neu ro nguon tai lieu: 'Theo DD v2.3, trang 15...'"),
    bullet("Neu ro man hinh hoac chuc nang: 'Tai man hinh Quan ly Nguoi Dung...'"),
    bullet("Neu ro trang thai hien tai: 'Hien tai table m_user co cau truc...'"),
    gap(),
    twoColBox(
      "Chua tot (thieu context)",
      ['"Field email co can validate khong?"'],
      "Tot (ro context)",
      ['"Theo DD man hinh Dang Ky (FR-003), field Email duoc danh dau bat buoc (dau * tren Mockup). Tuy nhien DD chua mo ta validation rule cu the."']
    ),
    gap(),
    h3("Sai lam thuong gap"),
    bullet("Khong neu nguon tai lieu (DD trang may? BD section nao?)."),
    bullet("Context qua rong (mo ta ca man hinh trong khi van de chi lien quan mot field)."),
    bullet("Context qua hep (chi neu ten field ma khong giai thich no o dau)."),
    gap(),
    h2("5.2 O - Observation (Diem Bat Thuong)"),
    body("Muc dich: Neu chinh xac dieu ban phat hien - diem thieu, diem mau thuan, hoac diem can quyet dinh."),
    gap(),
    h3("Cach viet"),
    bullet("Dung ngon ngu cu the, tranh mo ho."),
    bullet("Chi neu mot van de chinh trong mot QA."),
    bullet("Neu ro su mau thuan: 'X trong khi Y'."),
    gap(),
    twoColBox(
      "Chua tot (mo ho)",
      ['"DD chua day du."', '"Mockup va DD co van de."'],
      "Tot (cu the)",
      ['"DD mo ta 3 trang thai (draft/submitted/approved) trong khi Mockup hien thi 4 trang thai (them trang thai rejected)."']
    ),
    gap(),
    h2("5.3 A - Analysis (Phan Tich Tac Dong)"),
    body("Day la phan phan biet QA chat luong cao voi QA thong thuong. Phan tich tac dong giup khach hang hieu why this matters."),
    gap(),
    h3("Cach viet"),
    bullet("Neu ro tac dong cu the: 'Neu thieu X, chung toi khong the Y.'"),
    bullet("Neu ro rui ro: 'Neu implement theo hieu biet hien tai, co the anh huong den Z.'"),
    bullet("Neu ro quy mo tac dong: 'Van de nay anh huong den tat ca man hinh co danh sach.'"),
    gap(),
    twoColBox(
      "Chua tot (khong co analysis)",
      ['"DD chua co trang thai rejected. Nho confirm."'],
      "Tot (co analysis)",
      ['"Neu thieu trang thai rejected:',
       '1. Khong the implement luong tu choi don.',
       '2. Test case cho truong hop reject se khong chay duoc.',
       '3. DB chua co logic de rollback khi reject.',
       'Nho confirm."']
    ),
    gap(),
    h2("5.4 U - Understanding (Nhan Thuc Hien Tai)"),
    body("Phan nay the hien ban da suy nghi truoc khi hoi. Day la dieu khach hang Nhat danh gia cao nhat."),
    gap(),
    h3("Cach viet"),
    bullet("'Chung toi dang hieu rang...'"),
    bullet("'Theo nhan thuc hien tai cua chung toi...'"),
    bullet("'Chung toi gia dinh rang...'"),
    gap(),
    infoBox("Tai sao phan nay quan trong?", [
      "Khi ban viet 'Chung toi dang hieu rang X', ban the hien:",
      "- Da doc tai lieu.",
      "- Da phan tich.",
      "- Da hinh thanh nhan thuc.",
      "- Chi can xac nhan mot dieu cu the.",
      "",
      "Dieu nay rat khac voi: 'Cai nay lam nhu the nao?' - cau hoi khong the hien bat ky su phan tich nao.",
    ], COLOR.light),
    gap(),
    h2("5.5 P - Proposal (De Xuat)"),
    body("Phan nay de xuat giai phap thay vi chi neu van de. Day la thi duong giua QA trung binh va QA chat luong cao."),
    gap(),
    h3("Cach viet"),
    bullet("Neu it nhat mot phuong an cu the."),
    bullet("Neu ro hieu qua va han che cua tung phuong an."),
    bullet("Neu ro phuong an ban khuyen nghi (neu co)."),
    gap(),
    twoColBox(
      "Khong co proposal",
      ['"DD thieu trang thai rejected. Chung toi hieu nen them. Nho confirm."'],
      "Co proposal cu the",
      [
        '"Chung toi de xuat hai phuong an:',
        'Option A: Them trang thai rejected vao flow. Luong: submitted -> approved/rejected. Neu rejected, cho phep NV revise va resubmit.',
        'Option B: Xu ly reject ngoai he thong (email). He thong chi luu approved/draft.',
        'Chung toi khuyen nghi Option A vi dam bao audit trail. Nho confirm."'
      ]
    ),
    gap(),
    h2("5.6 C - Confirmation (Xac Nhan)"),
    body("Phan cuoi: Neu ro chinh xac ban can khach hang quyet dinh dieu gi."),
    gap(),
    h3("Cach viet"),
    bullet("Cau hoi cu the, co the tra loi Yes/No hoac chon phuong an."),
    bullet("Tranh cau hoi mo: 'Bac thay sao?' hoac 'Lam nhu the nao?'"),
    bullet("Chi yeu cau mot quyet dinh trong mot QA."),
    gap(),
    twoColBox(
      "Xac nhan mo ho",
      ['"Bac vui long huong dan them."', '"Nhom toi nen lam the nao?"'],
      "Xac nhan ro rang",
      [
        '"Nho Bac confirm: He thong co them trang thai rejected vao flow khong? (Yes = them, No = xu ly ngoai he thong)"',
        "",
        '"Nho Bac chon phuong an: Option A hay Option B?"'
      ]
    ),
    pageBreak()
  ];
}

// ===== PART 6 =====
function part6() {
  return [
    h1("PHAN 6: CAC LOAI QA TRONG DU AN"),
    body("Moi loai chuc nang co cac diem can QA dac thu. Phan nay cung cap checklist cho tung loai."),
    gap(),
    h2("6.1 Validation QA"),
    h3("Khi nao can?"),
    body("Khi Mockup co dau * (required) nhung DD khong mo ta validation, hoac khi chua ro validation rules."),
    gap(),
    h3("Checklist Validation QA"),
    check("Field co la bat buoc khong?"),
    check("Gia tri min/max la bao nhieu?"),
    check("Dinh dang (format) yeu cau la gi?"),
    check("Ky tu dac biet co duoc phep khong?"),
    check("Co chuyen doi du lieu (trim, lowercase) khong?"),
    check("Hien thi thong bao loi o dau? Noi dung la gi?"),
    check("Validate phia client, server, hay ca hai?"),
    gap(),
    h3("Mau QA Validation"),
    infoBox("Vi du QA Validation - Email Field", [
      "Context: Tai man hinh Dang Ky (FR-003), field Email duoc danh dau bat buoc.",
      "",
      "Observation: DD chua mo ta validation rules cho Email.",
      "",
      "Analysis: Neu khong co validation, he thong co the luu email sai dinh dang hoac de trong.",
      "",
      "Understanding: Chung toi hieu:",
      "- Email khong duoc de trong.",
      "- Email phai dung dinh dang xxx@yyy.zzz.",
      "- Khong phan biet hoa thuong.",
      "- Khong co gioi han do dai dac biet (theo chuan RFC 5321: max 254 ky tu).",
      "",
      "Proposal: Implement validation theo hieu biet tren.",
      "",
      "Confirmation: Nho Bac confirm hieu biet nay co chinh xac khong?",
    ]),
    gap(),
    h2("6.2 Permission QA"),
    h3("Khi nao can?"),
    body("Khi chuc nang co nhieu loai nguoi dung hoac khi DD chua mo ta ro quyen han cua tung role."),
    gap(),
    h3("Checklist Permission QA"),
    check("Co bao nhieu role trong he thong?"),
    check("Moi role duoc lam gi, khong duoc lam gi?"),
    check("Quyen co the phan cap (delegate) khong?"),
    check("Quyen co phu thuoc vao du lieu khong? (VD: chi sua du lieu cua minh?)"),
    check("Man hinh hien thi gi khi user khong co quyen?"),
    check("API co check permission phia server khong?"),
    gap(),
    h2("6.3 DB / Data QA"),
    h3("Khi nao can?"),
    body("Khi DD mo ta xu ly nhung DB chua co structure tuong ung."),
    gap(),
    h3("Checklist DB QA"),
    check("Field trong DD co ton tai trong DB khong?"),
    check("Kieu du lieu co phu hop khong?"),
    check("Constraint (NOT NULL, UNIQUE...) co dung khong?"),
    check("Soft delete hay hard delete?"),
    check("Audit log can luu nhung gi?"),
    check("Co can luu lich su thay doi khong?"),
    gap(),
    h2("6.4 API QA"),
    h3("Khi nao can?"),
    body("Khi API spec chua ro hoac chua khop voi DD/DB."),
    gap(),
    h3("Checklist API QA"),
    check("Request co du cac field can thiet khong?"),
    check("Response co tra du du lieu de hien thi khong?"),
    check("HTTP method co phu hop (GET/POST/PUT/DELETE)?"),
    check("Error code co duoc dinh nghia day du khong?"),
    check("Co can authentication header khong?"),
    check("Co gioi han pagination khong?"),
    check("Co handle timeout khong?"),
    gap(),
    h2("6.5 Business Flow QA"),
    h3("Khi nao can?"),
    body("Khi flow nghiep vu co nhieu buoc nhung chua ro exception handling hoac rollback."),
    gap(),
    h3("Checklist Business Flow QA"),
    check("Happy path da duoc mo ta chua?"),
    check("Exception case (loi, cancel, timeout) xu ly nhu the nao?"),
    check("Rollback strategy khi co loi la gi?"),
    check("Concurrent access (nhieu user cung luc) duoc xu ly nhu the nao?"),
    check("Deadline hoac time constraint co khong?"),
    check("Notification duoc gui khi nao va cho ai?"),
    pageBreak()
  ];
}

// ===== PART 7 =====
function part7() {
  return [
    h1("PHAN 7: NGUOI NHAT THUC SU MONG DOI DIEU GI?"),
    body("Hieu van hoa lam viec va ky vong cua khach hang Nhat la yeu to quyet dinh de QA cua ban duoc nhan tot."),
    gap(),
    h2("7.1 Dieu Khach Hang Nhat Danh Gia Cao"),
    gap(),
    infoBox("Top 5 dieu khach hang Nhat thich nhat trong QA", [
      "1. Da co phan tich truoc khi hoi",
      "   Ho biet ngay ban co doc tai lieu hay khong qua cach ban viet context.",
      "",
      "2. Co dan chung cu the tu tai lieu",
      "   'Theo DD trang 12, dong thu 3' the hien su nghiem tuc.",
      "",
      "3. De xuat phuong an xu ly",
      "   Khach hang Nhat rat quy trong doi tac de xuat giai phap thay vi chi neu van de.",
      "",
      "4. Nhan thuc ro rang de xac nhan",
      "   Ho chi can Yes/No, khong muon mat thoi gian giai thich lai tu dau.",
      "",
      "5. Cau hoi gon gang, ro muc dich",
      "   Mot QA, mot van de. Khong gop nhieu van de vao mot cau hoi.",
    ], COLOR.good),
    gap(),
    h2("7.2 Dieu Khach Hang Nhat Khong Thich"),
    gap(),
    infoBox("Cac loi khien khach hang that vong", [
      "1. Hoi nhung gi da co trong tai lieu",
      "   Day la tin hieu ban chua doc hoac khong doc ky.",
      "",
      "2. QA khong co context",
      "   'Field nay bat buoc khong?' - La field nao? Man hinh nao? Tai lieu nao?",
      "",
      "3. Nhieu van de trong mot QA",
      "   Khach hang kho tra loi va kho follow up.",
      "",
      "4. Gop QA cua nhieu chuc nang vao mot email",
      "   Lam mat thoi gian cua khach hang va kho quan ly.",
      "",
      "5. Hoi lai van de da duoc tra loi",
      "   Khong doc phan hoi truoc do la thieu ton trong.",
    ], COLOR.bad),
    gap(),
    h2("7.3 Loi Giao Tiep Pho Bien Voi Khach Hang Nhat"),
    gap(),
    twoColBox(
      "Loi pho bien",
      [
        '"Chung em khong biet can lam gi."',
        '"Em hoi cho chac."',
        '"Tai lieu thieu nen em hoi."',
        '"Em chua hieu nen hoi Bac."',
      ],
      "Cach noi chuyen nghiep hon",
      [
        '"Chung em da phan tich va co 2 phuong an. Nho Bac confirm."',
        '"Chung em da nghien cuu nhung con mot diem chua chac: X. Nho xac nhan."',
        '"Chung em phat hien gap trong DD ve phan X. De xuat Y. Nho confirm."',
        '"Chung em hieu la A. Neu dung, se implement theo B. Nho xac nhan."',
      ]
    ),
    gap(),
    h2("7.4 Van Hoa QA Trong Du An Nhat"),
    body("Mot so dieu can biet khi lam viec voi khach hang Nhat:"),
    gap(),
    bullet("Giai doan xac nhan (hanko bunka): Moi quyet dinh quan trong deu can duoc ghi nhan chinh thuc. QA chinh la cong cu de ghi nhan quyet dinh nay."),
    bullet("Ky vong ve chat luong tai lieu: Khach hang Nhat ky vong moi QA the hien doi da co chuan bi ky truoc khi hoi."),
    bullet("Tiet kiem thoi gian: Khach hang Nhat rat biet on khi QA giup ho tra loi nhanh (5 phut thay vi 30 phut)."),
    bullet("Ho tro trao doi: Viet QA bang tieng Nhat la loi the lon neu co the. Neu khong, viet bang tieng Anh chinh xac va ro rang."),
    pageBreak()
  ];
}

// ===== PART 8 - CASE STUDIES =====
function caseStudy(num, title, context, problem, badQA, goodQA, lesson) {
  const bdr = { style: BorderStyle.SINGLE, size: 1, color: COLOR.border };
  return [
    gap(80),
    new Paragraph({
      spacing: { before: 120, after: 60 },
      children: [
        new TextRun({ text: `Case ${num}: `, font: "Arial", size: 24, bold: true, color: COLOR.accent }),
        new TextRun({ text: title, font: "Arial", size: 24, bold: true, color: COLOR.primary }),
      ]
    }),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [1800, 7226],
      rows: [
        new TableRow({ children: [
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, shading: { fill: COLOR.light, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 1800, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Boi canh", font: "Arial", size: 20, bold: true, color: COLOR.primary })] })] }),
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 7226, type: WidthType.DXA }, shading: { fill: COLOR.white, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: context, font: "Arial", size: 20, color: COLOR.textMid })] })] })
        ]}),
        new TableRow({ children: [
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, shading: { fill: COLOR.light, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 1800, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Van de", font: "Arial", size: 20, bold: true, color: COLOR.primary })] })] }),
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 7226, type: WidthType.DXA }, shading: { fill: COLOR.white, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: problem, font: "Arial", size: 20, color: COLOR.textMid })] })] })
        ]}),
        new TableRow({ children: [
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, shading: { fill: "#FDECEA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 1800, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "QA chua tot", font: "Arial", size: 20, bold: true, color: "C62828" })] })] }),
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 7226, type: WidthType.DXA }, shading: { fill: "#FFF5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: badQA, font: "Arial", size: 20, color: COLOR.textMid, italics: true })] })] })
        ]}),
        new TableRow({ children: [
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, shading: { fill: "#E6F4EA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 1800, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "QA tot", font: "Arial", size: 20, bold: true, color: "1B5E20" })] })] }),
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 7226, type: WidthType.DXA }, shading: { fill: "#F5FFF7", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: goodQA, font: "Arial", size: 20, color: COLOR.textMid })] })] })
        ]}),
        new TableRow({ children: [
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, shading: { fill: COLOR.light, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 1800, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Bai hoc", font: "Arial", size: 20, bold: true, color: COLOR.primary })] })] }),
          new TableCell({ borders: { top: bdr, bottom: bdr, left: bdr, right: bdr }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 7226, type: WidthType.DXA }, shading: { fill: COLOR.boxBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: lesson, font: "Arial", size: 20, color: COLOR.primary, bold: true })] })] })
        ]}),
      ]
    }),
    gap(60),
  ];
}

function part8() {
  const cases = [
    ["1", "Soft Delete vs Hard Delete", "Man hinh Quan ly Nguoi Dung. DD mo ta chuc nang 'Xoa nguoi dung'.", "Table users khong co cot is_deleted. DD khong ghi ro xoa mem hay xoa cung.", '"Xoa nguoi dung lam nhu the nao?"', "Context: DD man hinh Quan ly NguoiDung mo ta nut 'Xoa'. Observation: Table users khong co cot is_deleted hoac deleted_at. Analysis: Neu hard delete, du lieu lien quan (don hang, lich su) bi anh huong. Understanding: Chung toi hieu nen dung soft delete. Proposal: Them cot is_deleted BIT DEFAULT 0 va deleted_at DATETIME. Confirmation: Nho confirm co dung soft delete khong?", "Khi thay 'Xoa' trong DD, luon hoi ngay: soft hay hard? Kem de xuat va ly do cu the."],
    ["2", "Import CSV - Xu Ly Loi", "Chuc nang import danh sach san pham tu file CSV. File co the len den 10,000 dong.", "DD mo ta: 'Hien thi ket qua import sau khi upload.' Nhung khong mo ta xu ly khi co dong loi.", '"Neu file CSV co loi thi sao?"', "Context: Chuc nang import CSV san pham (FR-015). File co the co 10,000 dong. Observation: DD khong mo ta xu ly khi co dong loi trong file. Analysis: Co 2 truong hop anh huong thiet ke DB va UX khac nhau. Understanding va Proposal: Option A: All-or-nothing - neu 1 dong loi, rollback toan bo. Option B: Partial import - import dong hop le, bao cao dong loi. Confirmation: Nho Bac chon Option A hay B?", "Import CSV luon can hoi ro ve error handling strategy truoc khi implement."],
    ["3", "Phan Quyen - Role-Based Access", "He thong co 3 role: Admin, Manager, Staff. DD mo ta chuc nang 'Sua thong tin nhan vien'.", "DD khong mo ta cu the ai duoc sua gi. Mockup khong co trang thai disabled.", '"Ai duoc sua thong tin nhan vien?"', "Context: Man hinh Chinh sua NV (HR-008). Co 3 role: Admin, Manager, Staff. Observation: DD mo ta nut 'Sua' nhung khong phan biet role. Analysis: Neu Staff tu sua luong cua minh se la bug nghiem trong. Understanding: Hieu Admin va Manager sua duoc. Staff chi xem. Proposal: Admin: sua tat ca. Manager: sua NV trong phong ban. Staff: chi xem. Nho confirm.", "Permission gap la loai bug nguy hiem nhat - phat hien som bang cach luon hoi ro 'Ai duoc lam gi?'"],
    ["4", "Email Thong Bao", "He thong gui email khi trang thai don hang thay doi.", "DD mo ta: 'He thong gui email thong bao.' Nhung khong ro gui cho ai, khi nao, noi dung gi.", '"Email gui nhu the nao?"', "Context: Tinh nang thong bao don hang (OR-005). Observation: DD mo ta gui email nhung thieu: (1) Gui cho ai (nguoi dat/bao gio/ca 2?). (2) Khi nao gui (moi trang thai hay chi approved?). (3) Template email la gi? (4) Xu ly neu gui that bai? Analysis: 4 yeu to tren anh huong design va logic khac nhau. Nho Bac xac nhan tung muc.", "Email notification luon co nhieu diem mo ho. Chia thanh cac cau hoi nho de khach hang de tra loi."],
    ["5", "Pagination - So Ban Ghi Mac Dinh", "Man hinh danh sach san pham co phan trang.", "Mockup hien thi pagination nhung khong ro so ban ghi mac dinh moi trang.", '"Pagination mac dinh la bao nhieu?"', "Context: Man hinh danh sach san pham (PR-002) co pagination. Observation: Mockup hien thi pagination control nhung DD va Mockup khong mo ta so ban ghi mac dinh moi trang. Analysis: Anh huong den UX va performance query. So qua lon (1000) co the cham, so qua nho (5) kho su dung. Understanding: Hieu default la 20 ban ghi/trang, user co the chon 10/20/50/100. Nho confirm.", "Pagination luon can hoi so mac dinh va cac option nguoi dung duoc chon."],
    ["6", "Audit Log - Ghi Nhat Ky", "Chuc nang chinh sua thong tin khach hang. Admin yeu cau co audit log.", "DD mo ta 'Can ghi audit log' nhung khong mo ta fields nao can luu, luu o dau.", '"Audit log ghi gi?"', "Context: Chuc nang chinh sua KH (CU-003). Requirement: Can audit log. Observation: DD khong mo ta: (1) Truong nao can ghi log? (2) Luu o table nao? (3) Luu bao lau? (4) Ai duoc xem? Analysis: Thiet ke bang audit_log phu thuoc vao 4 diem tren. Proposal: Them bang audit_logs (table_name, record_id, action, old_value, new_value, user_id, created_at). Nho confirm co dung khong.", "Audit log la yeu cau kho do. Luon hoi ro 4 dieu: luu gi, o dau, bao lau, ai xem."],
    ["7", "Search - Full Text vs Exact Match", "Man hinh tim kiem san pham theo ten.", "DD mo ta 'Tim kiem theo ten san pham' nhung khong ro loai tim kiem.", '"Tim kiem nhu the nao?"', "Context: Chuc nang tim kiem san pham (PR-004). Observation: DD mo ta tim kiem theo ten nhung khong ro: (1) Exact match hay contains? (2) Phan biet hoa thuong? (3) Tim kiem theo partial word duoc khong? (4) So luong ket qua toi da? Analysis: Anh huong den SQL query (=, LIKE, FULLTEXT) va performance. Understanding: Hieu dung LIKE '%keyword%', khong phan biet hoa thuong, max 100 ket qua. Nho confirm.", "Tim kiem co rat nhieu bien the. Hoi ro ngay de chon dung implementation approach."],
    ["8", "File Upload - Gioi Han", "Chuc nang upload anh dai dien nguoi dung.", "DD mo ta 'Nguoi dung upload anh dai dien' nhung khong co gioi han gi.", '"Upload anh gioi han nhu the nao?"', "Context: Chuc nang upload anh dai dien (US-007). Observation: DD khong mo ta: (1) Dinh dang cho phep (JPG, PNG, GIF?). (2) Kich thuoc toi da (MB). (3) Kich thuoc anh (pixel). (4) Luu o dau (server, S3, CDN?). Analysis: Thieu thong tin tren khong the implement an toan. Proposal: JPG/PNG, max 5MB, resize ve 200x200, luu S3. Nho confirm hoac dieu chinh.", "File upload luon co nhieu rang buoc implicit. Hoi ro truoc, lam sau."],
    ["9", "Xoa Du Lieu - Rang Buoc Lien Ket", "Chuc nang xoa danh muc san pham. Danh muc co the dang duoc dung boi san pham.", "DD mo ta 'Admin co the xoa danh muc' nhung khong mo ta xu ly khi danh muc dang duoc dung.", '"Xoa danh muc dang duoc dung thi sao?"', "Context: Chuc nang xoa danh muc (CT-002). Observation: DD khong mo ta xu ly khi danh muc dang duoc dung boi san pham. Analysis: Neu cho phep xoa, san pham se bi NULL category - loi hien thi. Proposal: Option A: Block xoa, hien thi thong bao so san pham dang dung. Option B: Soft delete danh muc, san pham giu category_id nhung hien thi [Da xoa]. Nho chon phuong an.", "Truoc khi xoa bat ky master data nao, luon hoi ve rang buoc lien ket voi cac bang khac."],
    ["10", "Workflow Duyet - Timeout", "Quy trinh duyet nghiep vu: NV gui -> Manager duyet -> Hoan thanh.", "DD mo ta happy path nhung khong mo ta truong hop Manager khong duyet trong thoi gian.", '"Neu Manager khong duyet thi sao?"', "Context: Quy trinh duyet don nghi phep (LV-001). Observation: DD mo ta happy path nhung khong mo ta timeout scenario. Analysis: Neu khong co timeout, don co the bi treo vinh vien. Anh huong ca UX lan SLA cua cong ty. Understanding: Hieu co timeout 3 ngay lam viec. Sau do don tu dong leo thang (escalate) len cap tren. Nho confirm timeout va escalation rule.", "Moi workflow deu can hoi ve timeout. Day la exception case thuong bi bo qua nhat trong BD/DD."]
  ];

  const result = [
    h1("PHAN 8: 10 CASE STUDY THUC CHIEN TIEU BIEU"),
    body("Phan nay trinh bay 10 tinh huong QA thuong gap nhat trong du an phan mem Nhat Ban. Moi case bao gom: boi canh, van de, QA chua tot, QA tot, va bai hoc rut ra."),
    gap(),
  ];

  for (const c of cases) {
    result.push(...caseStudy(...c));
  }

  result.push(pageBreak());
  return result;
}

// ===== PART 9 =====
function part9() {
  return [
    h1("PHAN 9: CHECKLIST REVIEW QA"),
    body("Truoc khi gui QA, hay tu review theo cac checklist sau day. Viec tu review giup tranh nhung sai lam co ban va tiet kiem thoi gian cua ca hai phia."),
    gap(),
    h2("9.1 Checklist Self-Review (Cho ca nhan)"),
    h3("Truoc khi viet QA"),
    check("Da doc day du Requirement va BD chua?"),
    check("Da doc DD lien quan chua?"),
    check("Da kiem tra DB schema chua?"),
    check("Da xem Mockup chua?"),
    check("Da cross-check giua cac tai lieu chua?"),
    check("Da thu tim cau tra loi trong tai lieu chua?"),
    gap(),
    h3("Khi viet QA (kiem tra tung phan COAUPC)"),
    check("Context: Da neu ro man hinh, chuc nang, tai lieu tham chieu chua?"),
    check("Observation: Da neu dung va chinh xac diem bat thuong chua?"),
    check("Analysis: Da neu ro tac dong neu van de khong duoc xu ly chua?"),
    check("Understanding: Da viet ro nhan thuc hien tai chua?"),
    check("Proposal: Da de xuat it nhat mot phuong an xu ly chua?"),
    check("Confirmation: Cau xac nhan co cu the, co the tra loi Yes/No chua?"),
    gap(),
    h3("Kiem tra cuoi"),
    check("QA chi chua dung mot van de chinh khong?"),
    check("Nguoi doc co the hieu QA nay trong 2 phut khong?"),
    check("Khach hang co the tra loi trong 5 phut khong?"),
    check("Co phat hien thay van de nay trong tai lieu khong hay tu suy nghi ra?"),
    check("Da ghi ro tieu de / ma QA de de theo doi khong?"),
    gap(),
    h2("9.2 Checklist Review Cho Leader / BA"),
    h3("Review chat luong phan tich"),
    check("QA co chung to nguoi viet da doc tai lieu khong?"),
    check("Phan tich impact co day du khong?"),
    check("De xuat co kha thi trong boi canh du an khong?"),
    check("Nhan thuc hien tai co chinh xac khong?"),
    gap(),
    h3("Review giao tiep"),
    check("Ngon ngu co chuyen nghiep, ro rang khong?"),
    check("Cau xac nhan co cu the khong?"),
    check("QA nay co xung dang gui khach hang khong?"),
    check("Neu khach hang tra loi 'Yes', team co biet phai lam gi tiep theo khong?"),
    gap(),
    h2("9.3 Checklist Review Cho SA"),
    h3("Review kien truc va he thong"),
    check("Van de nay co tac dong den kien truc khong?"),
    check("Co cac QA lien quan can gui cung luc khong?"),
    check("Quyet dinh nay co tao precedent cho cac truong hop tuong tu khong?"),
    check("Da xem xet impact len performance, security, scalability chua?"),
    check("De xuat co phu hop voi cac quyet dinh kien truc truoc do khong?"),
    pageBreak()
  ];
}

// ===== PART 10 =====
function part10() {
  return [
    h1("PHAN 10: CON DUONG TU DEVELOPER DEN SYSTEM ANALYST"),
    body("Phan nay mo ta lo trinh phat trien ky nang QA tu cap Developer den System Analyst. Hieu ro lo trinh nay giup ban biet can ren luyen gi o moi buoc."),
    gap(),
    h2("10.1 Cap Do Developer (0-2 nam)"),
    h3("Muc tieu o cap nay"),
    bullet("Doc va hieu tai lieu ky thuat."),
    bullet("Phat hien van de don gian trong DD hoac DB."),
    bullet("Viet QA co context va cau hoi cu the."),
    gap(),
    h3("Ky nang can ren luyen"),
    bullet("Doc tai lieu ky luong truoc khi code."),
    bullet("Ghi chep lai cac diem khong ro khi doc."),
    bullet("Hoc cach su dung framework COAUPC."),
    gap(),
    infoBox("Muc tieu thuc te:", [
      "Tao QA co the giup khach hang tra loi trong 15 phut (khong phai 2 phut ngay).",
      "Dat 70% QA khong bi tra lai vi thieu context.",
      "Phat hien duoc it nhat 80% van de trong DD truoc khi code."
    ]),
    gap(),
    h2("10.2 Cap Do Senior Developer (2-5 nam)"),
    h3("Muc tieu o cap nay"),
    bullet("Cross-check giua cac loai tai lieu."),
    bullet("Phat hien technical gap va design gap."),
    bullet("De xuat phuong an xu ly cu the."),
    bullet("Danh gia impact chinh xac."),
    gap(),
    h3("Su khac biet so voi Developer"),
    twoColBox(
      "Developer",
      [
        "Doc tung tai lieu rieng le.",
        "Hoi khi khong hieu.",
        "Tap trung vao implementation.",
        "QA phat sinh trong luc code.",
      ],
      "Senior Developer",
      [
        "Cross-check giua cac tai lieu.",
        "Hoi sau khi da phan tich.",
        "Nhin truoc rui ro implement.",
        "QA phat sinh tu doc tai lieu.",
      ]
    ),
    gap(),
    h2("10.3 Cap Do BA / Tech Lead (5+ nam)"),
    h3("Muc tieu o cap nay"),
    bullet("Phan tich toan bo business flow."),
    bullet("Nhin tu goc do nguoi dung va tac dong kinh doanh."),
    bullet("De xuat nhieu phuong an voi phan tich pro/con."),
    bullet("Uu tien QA theo impact va urgency."),
    gap(),
    h2("10.4 Cap Do System Analyst (8+ nam)"),
    h3("Dac diem QA cua SA"),
    bullet("Nhin toan he thong, khong chi mot chuc nang."),
    bullet("Phan tich impact len kien truc."),
    bullet("Phat hien cac GAP an (implicit gaps)."),
    bullet("De xuat giai phap co tinh den long-term maintainability."),
    bullet("QA cua SA thuong kem theo ADR (Architecture Decision Record)."),
    gap(),
    infoBox("Tieu chi de biet ban da dat cap SA trong QA", [
      "1. QA cua ban giup du an tranh rework lon (> 3 ngay).",
      "2. Khach hang nhan QA va confirm trong vong 1 ngay.",
      "3. Decision tu QA cua ban tro thanh tieu le cho cac du an sau.",
      "4. Team member hoc duoc cach viet QA tu ban.",
      "5. BA/PM coi QA cua ban la input de update tai lieu.",
    ], COLOR.good),
    gap(),
    h2("10.5 Lo Trinh Thuc Hanh"),
    body("Kien thuc trong cam nang nay chi huu ich khi ban ap dung vao thuc te. Duoi day la ke hoach 30-60-90 ngay:"),
    gap(),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [1800, 7226],
      rows: [
        headerRow(["Giai doan", "Muc tieu va hanh dong"], [1800, 7226]),
        dataRow(["30 ngay dau", "Ap dung framework COAUPC vao moi QA. So sanh QA cu va moi. Nho mentor review it nhat 5 QA/tuan."], [1800, 7226]),
        dataRow(["60 ngay", "Tu doc tai lieu va tao QA truoc khi code. Muc tieu: 90% QA khong can tra lai vi thieu info. Bat dau cross-check giua cac tai lieu."], [1800, 7226], COLOR.boxBg),
        dataRow(["90 ngay", "Tu de xuat phuong an trong moi QA. Danh gia impact chinh xac. Chia se bai hoc QA voi team."], [1800, 7226]),
      ]
    }),
    pageBreak()
  ];
}

// ===== CONCLUSION =====
function conclusion() {
  return [
    h1("KET LUAN"),
    body("QA khong phai la ky nang dat cau hoi. QA la ket qua cua:"),
    gap(80),
    infoBox("Con duong tao QA chat luong cao", [
      "Doc tai lieu ky luong",
      "    |",
      "    v",
      "Phat hien GAP",
      "    |",
      "    v",
      "Phan tich impact",
      "    |",
      "    v",
      "Danh gia lua chon",
      "    |",
      "    v",
      "De xuat phuong an",
      "    |",
      "    v",
      "Xac nhan quyet dinh"
    ], COLOR.light),
    gap(),
    body("Nguoi moi gui cau hoi."),
    body("Nguoi co kinh nghiem gui nhan thuc."),
    body("System Analyst gui giai phap va yeu cau xac nhan.", { bold: true }),
    gap(),
    body("Cam nang nay la nen tang. Ky nang that su den tu viec ap dung vao tung du an thuc te, tu tung lan viet QA va tu tung lan nhan phan hoi."),
    gap(),
    body("Hay bat dau tu bai tap don gian nhat: lan toi ban doc tai lieu, hay viet ra tat ca nhung diem chua ro theo format COAUPC truoc khi gui cho bat ky ai."),
    gap(),
    body("Day la buoc dau tien de tro thanh nguoi viet QA chat luong cao.", { italic: true }),
  ];
}

// ===== BUILD DOCUMENT =====
async function buildDocument() {
  const children = [
    ...coverPage(),
    ...preface(),
    ...part1(),
    ...part2(),
    ...part3(),
    ...part4(),
    ...part5(),
    ...part6(),
    ...part7(),
    ...part8(),
    ...part9(),
    ...part10(),
    ...conclusion(),
  ];

  const doc = new Document({
    numbering: NUMBERING,
    styles: {
      default: {
        document: { run: { font: "Arial", size: 22, color: COLOR.textMid } }
      },
      paragraphStyles: [
        {
          id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Arial", color: COLOR.primary },
          paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0,
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.primary, space: 2 } } }
        },
        {
          id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: "Arial", color: COLOR.accent },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.accent, space: 1 } } }
        },
        {
          id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: "Arial", color: COLOR.primary },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
        },
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('/home/claude/qa_handbook.docx', buffer);
  console.log('Document created: qa_handbook.docx');
}

buildDocument().catch(console.error);