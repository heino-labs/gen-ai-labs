# SYSTEMA — The Operable Knowledge Machine

> Một giao diện cho blog DevOps/IT **không phải là website để đọc, mà là một cỗ máy để vận hành.**
> Bỏ hoàn toàn mô hình navbar + hero + grid card + footer. Thay vào đó: một **bo mạch (circuit board) có thể pan/zoom**, nơi mỗi bài viết là một **con chip** được hàn lên board và nối với nhau bằng **dây dẫn (trace)**; bạn cũng có thể điều khiển nó bằng một **terminal CRT**. Đọc một bài = **cấp điện cho chip**; điện lan theo dây; chip bị khoá sẽ **boot** khi đủ điều kiện. Tiến độ không phải thanh progress — nó là **sự tiến hoá cấu trúc của cả cỗ máy**.

---

## 0. Tại sao lại là metaphor "cỗ máy / bo mạch"?

Brief yêu cầu *lai ghép metaphor* chứ không khoá vào một chủ đề. Bo mạch + dây dẫn là metaphor mạnh nhất cho DevOps vì nó **đồng thời** là:

| Metaphor trong brief | Hiện thân trong SYSTEMA |
|---|---|
| Knowledge graph (nodes + edges) | Chip = node, Trace = edge (prereq / related) |
| Mechanical system (modules wired) | Subsystem = cụm module, Bus rail = đường truyền |
| Terminal command navigation | Console CRT: `ls / cd / open / find / path` |
| Skill tree / progression | Điện lan theo trace, chip khoá "boot" khi đủ prereq |
| File system explorer | `cd linux` → vào subsystem; chip = file/artifact |
| Zoomable canvas (Figma/Miro) | Board pan/zoom + **semantic zoom** 3 cấp |

Một metaphor, sáu mô hình điều hướng — đó là "controlled chaos" có chủ đích, không phải gimmick rời rạc.

---

## 1. Concept layout (chi tiết)

### 1.1 Ba "view" trên cùng một dữ liệu (ba lăng kính, không phải ba trang)

- **BOARD** (mặc định) — bản đồ bo mạch không gian. Đây là paradigm điều hướng chính, **không cuộn dọc**.
- **CONSOLE** — terminal phosphor, điều hướng bằng lệnh cho người thích bàn phím.
- **STREAM** — danh sách tối giản, có thể truy cập (a11y/SEO/mobile yếu). Đây là "van an toàn" giúp giao diện vẫn *dùng được*.

Người dùng chuyển view bất cứ lúc nào; trạng thái (chip nào đã cấp điện, camera ở đâu) được chia sẻ giữa các view.

### 1.2 Giải phẫu màn hình BOARD

```
┌─────────────────────────────────────────────────────────────┐
│  HUD (góc trái-trên): INTEGRITY 38%  ·  subsystem power LEDs  │
│                                            [BOARD|CONSOLE|≡]  │
│                                                              │
│            ╔══ SUBSYSTEM: LINUX ══╗      ╔══ DEVOPS ══╗       │
│            ║   ▢ commands ●───────╫──────╫─▢ gitlab   ║       │
│            ║      │                ║      ║    │       ║       │
│            ║   ▢ ssh ◐             ║      ╚════╪═══════╝       │
│            ╚════════╪══════════════╝           │              │
│      ════ BUS: security ═══════════════════════╪═════════     │
│            ▢ users-groups 🔒                    ▢ cicd 🔒      │
│                                                              │
│  ┌─ MINIMAP ─┐                          ┌── CONSOLE ───────┐ │
│  │  ▦  · ·   │                          │ sys:// _         │ │
│  │  ·  ▣ ·   │                          │ > open ssh       │ │
│  └───────────┘                          └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
●=powered  ◐=active/đang đọc  ▢=dormant(mở khoá)  🔒=locked
```

- **Chip (Module):** một con IC có *pin* (chân), nhãn silkscreen, một **LED trạng thái**, và hào quang mối hàn. Không phải card.
- **Trace (dây dẫn):** SVG path nối chip. Loại: `prereq` (đặc, có hướng), `related` (mảnh, nét đứt), `bus` (đường ngang xuyên subsystem).
- **Subsystem zone:** vùng kính mờ bao quanh cụm chip cùng category, có nhãn khắc + **bus rail** ở mép.
- **Bus rail (tag):** tag KHÔNG phải nhãn trang trí — nó là một **đường ray vật lý** chạy xuyên nhiều subsystem. Click vào bus → mọi chip thuộc bus đó sáng lên; bạn "đi tàu" theo bus để nhảy giữa các vùng. Tag ⇒ **cấu trúc**, không phải filter phẳng.

### 1.3 Semantic zoom (chống quá tải = vẫn dùng được)

| Scale | Cấp | Hiển thị |
|---|---|---|
| `< 0.6` | **Satellite** | Chỉ vùng subsystem phát sáng + các bus chính. Nhìn toàn cảnh "thành phố". |
| `0.6–1.6` | **Board** | Chip + nhãn + trace. Mức làm việc chính. |
| `> 1.6` | **Datasheet** | Chip nở ra: hiện pin, prereq, reading-time, nút "INSPECT". |

Zoom không chỉ phóng to pixel — nó **đổi loại thông tin**. Đây là lý do board chứa hàng chục chip mà không rối.

---

## 2. Interaction model

### 2.1 Điều hướng phi tuyến, nhiều lối vào

Một bài có thể tiếp cận bằng **5 con đường** khác nhau:

1. **Không gian** — pan/zoom tới cụm subsystem.
2. **Bus/tag** — click một ray, lần theo đường sáng sang vùng khác.
3. **Lệnh** — `find ssh`, `open gitlab`.
4. **Tuyến (route)** — `path setup gitlab` vẽ một lộ trình sáng và camera tự bay dọc theo.
5. **Probe ngẫu nhiên** — nút 🎲 "PROBE" nhảy tới một chip chưa cấp điện gần các chip đã cấp (gợi ý học tiếp).

### 2.2 Cử chỉ

- **Pan:** kéo chuột/ngón tay (có quán tính nhẹ).
- **Zoom:** cuộn (zoom về phía con trỏ) / pinch.
- **Hover chip:** neighbors sáng lên, phần còn lại mờ ~25%, trace của nó chạy *dash flow*, **datasheet** trồi lên.
- **Click chip:** camera bay tới + **cấp điện** + mở **Inspector** (panel "mở artifact") chứa tóm tắt + nút mở bài đầy đủ.
- **Click bus rail:** highlight toàn bus.
- **Phím:** `/` focus console, `Esc` đóng inspector, mũi tên lia camera, `+/-` zoom.

### 2.3 Console — ngữ pháp lệnh

```
ls                 # liệt kê subsystem (như thư mục)
cd linux           # lia camera vào subsystem linux
open ssh           # mở + cấp điện chip ssh
find <từ khoá>     # tìm chip, gõ sáng kết quả trên board
path setup gitlab  # BFS, vẽ tuyến + bay dọc theo
power ssh          # chỉ cấp điện, không mở
trace ssh          # liệt kê hàng xóm (pin in/out)
reset              # tắt điện toàn hệ (xác nhận)
help               # bảng lệnh
```

Console và Board **đồng bộ hai chiều**: gõ `open ssh` thì chip ssh trên board cũng sáng và camera bay tới; click chip thì console in `> open ssh`.

---

## 3. Component breakdown (React)

```
<SystemExplorer>                 # root, giữ state + SystemContext
├─ <HUD/>                        # integrity %, LED subsystem, view switch, reset, PROBE
├─ <ViewSwitch/>                 # BOARD | CONSOLE | STREAM
│
├─ <Board/>                      # canvas pan/zoom (transform 1 lớp), tính zoom level
│  ├─ <Camera/>                  # áp dụng translate+scale, xử lý wheel/drag/pinch
│  ├─ <TraceLayer/>              # <svg>: tất cả edge (prereq/related/bus)
│  │   └─ <Trace/>               # 1 path; class dormant|live|locked; dashflow + packet
│  ├─ <SubsystemZone/>           # hull kính mờ + nhãn khắc cho mỗi category
│  ├─ <BusRail/>                 # đường ray tag xuyên zone
│  └─ <Chip/>                    # module: pin, LED, label, state
│      └─ <Datasheet/>           # tooltip khi hover / zoom gần
│
├─ <Console/>                    # terminal: parser + log + lịch sử lệnh
├─ <Inspector/>                  # panel "mở artifact" khi chọn chip (reader/summary)
├─ <Minimap/>                    # tổng quan + khung camera (chống lạc)
├─ <Legend/>                     # giải nghĩa LED/trace (giữ controlled-chaos dễ hiểu)
└─ <StreamView/>                 # fallback danh sách phẳng (a11y/SEO)

hooks:
  useSystem()      → { powered, unlock, isUnlocked, power, neighbors, routeBetween, integrity }
  useCamera()      → { x, y, scale, flyTo, zoomAt, level }
  usePersist()     → đồng bộ powered/visited ↔ localStorage
```

### 3.1 State engine (cốt lõi của "tiến hoá cấu trúc")

```ts
// một chip không phải card — nó là object có trạng thái + quan hệ
type Module = {
  id: string;
  title: string;
  subsystem: string;          // category → zone
  buses: string[];            // tags → bus rails
  prereqs: string[];          // pin vào (điều kiện boot)
  related: string[];          // edge mềm
  pos: { x: number; y: number };   // toạ độ board (đặt tay / force-layout seed)
  href: string;
  readingTime: string;
  summary: string;
};

type State = 'locked' | 'dormant' | 'powered' | 'active';

function stateOf(m: Module, powered: Set<string>, active: string): State {
  if (m.id === active) return 'active';
  if (powered.has(m.id)) return 'powered';
  const unlocked = m.prereqs.every(p => powered.has(p)); // skill-tree gate
  return unlocked ? 'dormant' : 'locked';
}

// cấp điện 1 chip → lan charge → mở khoá downstream
function power(id) {
  setPowered(prev => {
    const next = new Set(prev).add(id);
    // chip nào vừa đủ prereq sẽ tự chuyển locked→dormant (boot animation)
    return next;
  });
  pulseAlongOutgoingTraces(id);   // hiệu ứng điện chạy
}

// integrity = tiến độ dạng cấu trúc, KHÔNG phải %đọc tuyến tính
const integrity = powered.size / modules.length;
```

---

## 4. Sample layout structure (JSX rút gọn)

```jsx
function SystemExplorer() {
  const sys = useSystem();           // powered/active/integrity...
  const cam = useCamera();           // x,y,scale,level,flyTo
  const [view, setView] = useState('board');

  return (
    <div className="fixed inset-0 bg-[#05060a] text-zinc-200 overflow-hidden select-none">
      <HUD integrity={sys.integrity} onReset={sys.reset} onProbe={sys.probe} />
      <ViewSwitch value={view} onChange={setView} />

      {view === 'board' && (
        <Board camera={cam}>
          {/* 1 lớp duy nhất được transform: translate(x,y) scale(s) */}
          <TraceLayer edges={edges} powered={sys.powered} level={cam.level} />
          {subsystems.map(s => <SubsystemZone key={s.id} {...s} />)}
          {buses.map(b => <BusRail key={b.id} {...b} active={sys.busActive===b.id} />)}
          {modules.map(m => (
            <Chip
              key={m.id}
              module={m}
              state={stateOf(m, sys.powered, sys.active)}
              level={cam.level}
              onHover={() => sys.hover(m.id)}
              onClick={() => { cam.flyTo(m.pos); sys.open(m.id); }}
            />
          ))}
        </Board>
      )}

      {view === 'console' && <Console sys={sys} cam={cam} />}
      {view === 'stream'  && <StreamView modules={modules} powered={sys.powered} />}

      <Console sys={sys} cam={cam} docked />   {/* luôn có ở Board, thu gọn được */}
      <Minimap camera={cam} modules={modules} powered={sys.powered} />
      <Legend />
      <Inspector module={sys.activeModule} onClose={sys.close} />
    </div>
  );
}

// Chip — không dùng <a>/<card>, là một "linh kiện"
function Chip({ module: m, state, level, onHover, onClick }) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onClick}
      data-state={state}
      style={{ transform: `translate(${m.pos.x}px, ${m.pos.y}px)` }}
      className="chip absolute group"
    >
      <span className="chip__led" />                {/* LED đổi màu theo state */}
      <span className="chip__pins" aria-hidden />    {/* chân IC */}
      <span className="chip__label">{m.title}</span>
      {level === 'datasheet' && <Datasheet m={m} />}
    </button>
  );
}
```

---

## 5. Animation & interaction behaviors

| Sự kiện | Hành vi | Kỹ thuật (perf-safe) |
|---|---|---|
| Hover chip | neighbors sáng, còn lại mờ 25%, trace dash-flow, datasheet trồi | `opacity`/`stroke-dashoffset`, không layout |
| Cấp điện (đọc) | LED xanh, mối hàn "bloom", **xung điện chạy** dọc trace ra ngoài | `stroke-dashoffset` keyframe + glow filter |
| Boot chip vừa mở khoá | flicker → sáng dần (locked→dormant) | `opacity` + 2 nhịp flicker |
| Idle "alive" | LED nhấp nháy 1–2%, packet dots chạy trên trace *live* | `requestAnimationFrame`, transform-only |
| Bus highlight | mọi chip trên bus underglow theo màu bus | toggle class |
| `path a→b` | vẽ tuyến sáng + camera bay dọc tuyến | BFS + `flyTo` tween |
| Zoom qua ngưỡng | đổi cấp semantic (satellite/board/datasheet) | class theo `scale` |
| Hoàn thành subsystem | bus rail sáng hết + **lộ connector ẩn** sang subsystem khác (path mới) | reveal edge bị ẩn |
| `prefers-reduced-motion` | tắt packet/flicker/inertia, giữ chuyển trạng thái tức thì | media query guard |

Nguyên tắc perf: **chỉ animate `transform` và `opacity`** (GPU), board là **một lớp transform duy nhất** (không transform từng chip khi pan), SVG cho trace, không WebGL. Vài chục node chạy 60fps thoải mái.

---

## 6. Vì sao nó phá vỡ UX blog truyền thống mà vẫn dùng được

**Phá vỡ:**
- Không navbar/hero/grid/footer. Điều hướng = **không gian + lệnh**, không phải menu.
- Khám phá là **thám hiểm đa lối**, không phải tiêu thụ tuyến tính.
- Bài viết là **vật thể có trạng thái & quan hệ**, không phải card đồng nhất.
- Tiến độ là **cỗ máy sáng dần lên**, không phải thanh %.
- Tag **đổi cấu trúc** (gom/nối/ẩn-hiện), không phải nhãn lọc phẳng.

**Vẫn dùng được (chống "cool nhưng rối"):**
- **Minimap + Legend + semantic zoom** → không bao giờ lạc, không quá tải.
- **Console `find/path`** → ai vội vẫn nhảy thẳng tới đích bằng bàn phím.
- **STREAM view + SSR danh sách** → a11y, SEO, mobile yếu vẫn đọc được toàn bộ.
- **Layout tất định** (toạ độ cố định) → bản đồ ổn định trong tâm trí người dùng; "slightly unpredictable" chỉ ở hiệu ứng sống động, **không** ở vị trí.
- **Reduced-motion** tôn trọng người nhạy cảm chuyển động.

> Tóm lại: một developer chán blog hiện đại mở SYSTEMA lên sẽ thấy *một bảng điều khiển sống*, tự tay cấp điện cho kiến thức và nhìn cỗ máy của chính mình sáng dần — trải nghiệm chưa từng thấy, nhưng vẫn tìm được bài trong 2 giây nếu muốn.

---

## 7. Cách lắp vào dự án Next.js hiện có

- Hạ tầng đã có (MDX, content registry, reader) **giữ nguyên giá trị**: bài viết vẫn là MDX, vẫn có trang đọc.
- Mở rộng `content.ts`: thêm `prereqs`, `related`, `buses`, `pos` cho mỗi post → đủ dữ liệu dựng graph.
- `SystemExplorer` thay cho homepage (`/`). Click chip → mở `Inspector`; "Open full guide" điều hướng tới trang MDX `/linux/ssh`.
- Trang đọc MDX khoác lại aesthetic "artifact/console" (mối hàn, nhãn khắc, mono) thay cho look SaaS.
- `STREAM` chính là trang `/stream` tĩnh để SEO/sitemap.
```
```
