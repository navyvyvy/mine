# Mining Core Full Map / 채굴 코어 전체 노드 맵

## Node Count

```text
Center = 1
Pickaxe = 47
Lantern = 47
Gloves = 47
Deep Core = 47
Total = 189
```

## Branch Identity

```text
Pickaxe = single-target breaking power and crack control
Lantern = ore appearance probability, ore density, ore upgrade chance, and discovery
Gloves = hand-work upgrades: speed, recovery, debris clear, and resonant nearby breaking
Deep Core = offline and long-term probability support
```

## Removed Effects

```text
LANTERN_ORE_DENSITY_CHANCE removed
LANTERN_ORE_UPGRADE_CHANCE removed
GLOVES_DEBRIS_CLEAR_SPEED removed
```

| ID | Slot | Rarity | Name | Parents | Cost | Layer | Position | Effect |
|---:|---:|---|---|---|---|---|---|---|
| 0 | - | CENTER | 채굴 코어 / Mining Core |  | FREE |  | (0,0) | `CENTER_UNLOCK` unlocks Mining Core |
| 1000 | 0 | UNIQUE | 낡은 곡괭이 / Worn Pickaxe | 0 | C1 |  | (1,0) | `PICKAXE_BASE_UNLOCK` unlocks Pickaxe branch |
| 1001 | 1 | COMMON | 균열 찍기 I / Crack Tap I | 1000 | C1 |  | (2,0) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1002 | 2 | COMMON | 바위 결 읽기 I / Read the Grain I | 1001 | C1 |  | (3,-1) | `PICKAXE_REQUIRED_HIT_REDUCTION` chance to lower rock durability when face is generated |
| 1003 | 3 | COMMON | 단단한 날 I / Hard Edge I | 1001 | C1 |  | (3,1) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1004 | 4 | MAGIC | 광석 끌 II / Ore Chisel II | 1002 | C1 |  | (4,-2) | `PICKAXE_ORE_CRACK_PLUS` chance for one extra crack on ore block first hit |
| 1005 | 5 | RARE | 첫 타격 III / First Smash III | 1003 | C1 |  | (4,2) | `PICKAXE_FIRST_HIT_PLUS` chance for stronger first hits on each face |
| 1006 | 6 | COMMON | 집중 파괴 I / Focused Break I | 1004 | C1 |  | (5,-1) | `PICKAXE_FOCUSED_CRACK_CHANCE` chance to add one extra crack to the current target only |
| 1007 | 7 | MAGIC | 암반 절개 II / Rock Cleave II | 1005 | C1 |  | (5,1) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1008 | 8 | RARE | 중심 타격 III / Center Strike III | 1006,1007 | C2 | 1 | (6,0) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1009 | 9 | COMMON | 깊은 균열 I / Deep Fracture I | 1008 | C2 | 1 | (7,-2) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1010 | 10 | COMMON | 코어 절단 I / Core Cut I | 1008 | C2 | 1 | (7,2) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1011 | 11 | MAGIC | 균열 찍기 II / Crack Tap II | 1009 | C2 | 1 | (8,-3) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1012 | 12 | UNIQUE | 돌 곡괭이 / Stone Pickaxe | 1010,1011 | C2 | 1 | (8,3) | `PICKAXE_TIER_STONE` tier=stone, unlocks stronger first-hit breaking feel |
| 1013 | 13 | COMMON | 바위 결 읽기 I / Read the Grain I | 1012 | C2 | 1 | (9,-1) | `PICKAXE_REQUIRED_HIT_REDUCTION` chance to lower rock durability when face is generated |
| 1014 | 14 | COMMON | 단단한 날 I / Hard Edge I | 1012 | C2 | 1 | (9,1) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1015 | 15 | MAGIC | 광석 끌 II / Ore Chisel II | 1013 | C2 | 1 | (10,-2) | `PICKAXE_ORE_CRACK_PLUS` chance for one extra crack on ore block first hit |
| 1016 | 16 | RARE | 첫 타격 III / First Smash III | 1014,1015 | C3 | 2 | (10,2) | `PICKAXE_FIRST_HIT_PLUS` chance for stronger first hits on each face |
| 1017 | 17 | COMMON | 집중 파괴 I / Focused Break I | 1016 | C3 | 2 | (11,0) | `PICKAXE_FOCUSED_CRACK_CHANCE` chance to add one extra crack to the current target only |
| 1018 | 18 | MAGIC | 암반 절개 II / Rock Cleave II | 1017 | C3 | 2 | (12,-2) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1019 | 19 | MAGIC | 중심 타격 II / Center Strike II | 1017 | C3 | 2 | (12,2) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1020 | 20 | UNIQUE | 구리 곡괭이 / Copper Pickaxe | 1018,1019 | C3 | 2 | (13,0) | `PICKAXE_TIER_COPPER` tier=copper, improves ore-block first-hit crack chance |
| 1021 | 21 | COMMON | 깊은 균열 I / Deep Fracture I | 1020 | C3 | 2 | (14,-3) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1022 | 22 | COMMON | 코어 절단 I / Core Cut I | 1020 | C3 | 2 | (14,3) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1023 | 23 | COMMON | 균열 찍기 I / Crack Tap I | 1021 | C3 | 2 | (15,-1) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1024 | 24 | COMMON | 바위 결 읽기 I / Read the Grain I | 1022 | C4 | 3 | (15,1) | `PICKAXE_REQUIRED_HIT_REDUCTION` chance to lower rock durability when face is generated |
| 1025 | 25 | RARE | 단단한 날 III / Hard Edge III | 1023 | C4 | 3 | (16,-2) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1026 | 26 | RARE | 광석 끌 III / Ore Chisel III | 1024 | C4 | 3 | (16,2) | `PICKAXE_ORE_CRACK_PLUS` chance for one extra crack on ore block first hit |
| 1027 | 27 | MAGIC | 첫 타격 II / First Smash II | 1025 | C4 | 3 | (17,-3) | `PICKAXE_FIRST_HIT_PLUS` chance for stronger first hits on each face |
| 1028 | 28 | MAGIC | 집중 파괴 II / Focused Break II | 1026 | C4 | 3 | (17,3) | `PICKAXE_FOCUSED_CRACK_CHANCE` chance to add one extra crack to the current target only |
| 1029 | 29 | COMMON | 암반 절개 I / Rock Cleave I | 1027 | C4 | 3 | (18,-1) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1030 | 30 | COMMON | 중심 타격 I / Center Strike I | 1028 | C4 | 3 | (18,1) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1031 | 31 | RARE | 깊은 균열 III / Deep Fracture III | 1029,1030 | C4 | 3 | (19,0) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1032 | 32 | COMMON | 코어 절단 I / Core Cut I | 1031 | C5 | 4 | (20,-2) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1033 | 33 | UNIQUE | 철 곡괭이 / Iron Pickaxe | 1031 | C5 | 4 | (20,2) | `PICKAXE_TIER_IRON` tier=iron, improves hard-block breaking chance |
| 1034 | 34 | COMMON | 균열 찍기 I / Crack Tap I | 1032 | C5 | 4 | (21,-3) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1035 | 35 | COMMON | 바위 결 읽기 I / Read the Grain I | 1033 | C5 | 4 | (21,3) | `PICKAXE_REQUIRED_HIT_REDUCTION` chance to lower rock durability when face is generated |
| 1036 | 36 | MAGIC | 단단한 날 II / Hard Edge II | 1034 | C5 | 4 | (22,-2) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1037 | 37 | MAGIC | 광석 끌 II / Ore Chisel II | 1035 | C5 | 4 | (22,2) | `PICKAXE_ORE_CRACK_PLUS` chance for one extra crack on ore block first hit |
| 1038 | 38 | RARE | 첫 타격 III / First Smash III | 1036 | C5 | 4 | (23,-1) | `PICKAXE_FIRST_HIT_PLUS` chance for stronger first hits on each face |
| 1039 | 39 | RARE | 집중 파괴 III / Focused Break III | 1037 | C5 | 4 | (23,1) | `PICKAXE_FOCUSED_CRACK_CHANCE` chance to add one extra crack to the current target only |
| 1040 | 40 | MAGIC | 암반 절개 II / Rock Cleave II | 1038 | C6 | 5 | (24,-3) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1041 | 41 | MAGIC | 중심 타격 II / Center Strike II | 1039 | C6 | 5 | (24,3) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1042 | 42 | RARE | 깊은 균열 III / Deep Fracture III | 1040 | C6 | 5 | (25,-1) | `PICKAXE_CRACK_PLUS` chance to add one extra crack on hit |
| 1043 | 43 | RARE | 코어 절단 III / Core Cut III | 1041,1042 | C6 | 5 | (25,1) | `PICKAXE_HARD_CRACK_PLUS` chance for one extra crack on hard block first hit |
| 1044 | 44 | UNIQUE | 수정 곡괭이 / Crystal Pickaxe | 1043 | C6 | 5 | (26,-1) | `PICKAXE_TIER_CRYSTAL` tier=crystal, improves adjacent crack spread chance |
| 1045 | 45 | RARE | 다이아 집중 III / Diamond Focus III | 1044 | C6 | Diamond Depth | d=28,o=1 | `PICKAXE_FOCUSED_CRACK_CHANCE` final bridge, current-target extra crack chance |
| 1046 | 46 | UNIQUE | 다이아 곡괭이 / Diamond Pickaxe | 1045 | C6 | Diamond Depth | d=29,o=0 | `PICKAXE_TIER_DIAMOND` tier=diamond, capstone breaking chance boost |
| 2000 | 0 | UNIQUE | 낡은 랜턴 / Worn Lantern | 0 | C1 |  | (0,-1) | `LANTERN_BASE_UNLOCK` unlocks Lantern branch |
| 2001 | 1 | COMMON | 광맥 희미한 빛 I / Ore Spot Glow I | 2000 | C1 |  | (0,-2) | `LANTERN_ORE_SPOT_WEIGHT` increases ore-spot face appearance chance |
| 2002 | 2 | COMMON | 광맥의 실루엣 I / Vein Silhouette I | 2001 | C1 |  | (-1,-3) | `LANTERN_VEIN_WEIGHT` increases ore-vein face appearance chance |
| 2003 | 3 | COMMON | 풍부한 반짝임 I / Rich Glimmer I | 2001 | C1 |  | (1,-3) | `LANTERN_RICH_WEIGHT` increases rich-face appearance chance |
| 2004 | 4 | MAGIC | 희귀한 반사 II / Rare Reflection II | 2002 | C1 |  | (-2,-4) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2005 | 5 | RARE | 광물 밀도 III / Ore Density III | 2003 | C1 |  | (2,-4) | `LANTERN_ORE_DENSITY_CHANCE` chance for one additional ore slot when generating a face |
| 2006 | 6 | COMMON | 빛의 보너스 I / Light Bonus I | 2004 | C1 |  | (-1,-5) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2007 | 7 | MAGIC | 숨은 주머니 II / Hidden Pocket II | 2005 | C1 |  | (1,-5) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2008 | 8 | RARE | 광석 승급 III / Ore Upgrade III | 2006,2007 | C2 | 1 | (0,-6) | `LANTERN_ORE_UPGRADE_CHANCE` chance to upgrade one generated ore to a better valid ore in the layer |
| 2009 | 9 | COMMON | 희귀 반짝임 I / Rare Glint I | 2008 | C2 | 1 | (-2,-7) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2010 | 10 | COMMON | 깊은 등불 I / Deep Lamp I | 2008 | C2 | 1 | (2,-7) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2011 | 11 | MAGIC | 광맥 희미한 빛 II / Ore Spot Glow II | 2009 | C2 | 1 | (-3,-8) | `LANTERN_ORE_SPOT_WEIGHT` increases ore-spot face appearance chance |
| 2012 | 12 | UNIQUE | 돌 랜턴 / Stone Lantern | 2010,2011 | C2 | 1 | (3,-8) | `LANTERN_TIER_STONE` tier=stone, increases ore-spot appearance chance |
| 2013 | 13 | COMMON | 광맥의 실루엣 I / Vein Silhouette I | 2012 | C2 | 1 | (-1,-9) | `LANTERN_VEIN_WEIGHT` increases ore-vein face appearance chance |
| 2014 | 14 | COMMON | 풍부한 반짝임 I / Rich Glimmer I | 2012 | C2 | 1 | (1,-9) | `LANTERN_RICH_WEIGHT` increases rich-face appearance chance |
| 2015 | 15 | MAGIC | 희귀한 반사 II / Rare Reflection II | 2013 | C2 | 1 | (-2,-10) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2016 | 16 | RARE | 광물 밀도 III / Ore Density III | 2014,2015 | C3 | 2 | (2,-10) | `LANTERN_ORE_DENSITY_CHANCE` chance for one additional ore slot when generating a face |
| 2017 | 17 | COMMON | 빛의 보너스 I / Light Bonus I | 2016 | C3 | 2 | (0,-11) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2018 | 18 | MAGIC | 숨은 주머니 II / Hidden Pocket II | 2017 | C3 | 2 | (-2,-12) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2019 | 19 | MAGIC | 광석 승급 II / Ore Upgrade II | 2017 | C3 | 2 | (2,-12) | `LANTERN_ORE_UPGRADE_CHANCE` chance to upgrade one generated ore to a better valid ore in the layer |
| 2020 | 20 | UNIQUE | 구리 랜턴 / Copper Lantern | 2018,2019 | C3 | 2 | (0,-13) | `LANTERN_TIER_COPPER` tier=copper, increases vein-face appearance chance |
| 2021 | 21 | COMMON | 희귀 반짝임 I / Rare Glint I | 2020 | C3 | 2 | (-3,-14) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2022 | 22 | COMMON | 깊은 등불 I / Deep Lamp I | 2020 | C3 | 2 | (3,-14) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2023 | 23 | COMMON | 광맥 희미한 빛 I / Ore Spot Glow I | 2021 | C3 | 2 | (-1,-15) | `LANTERN_ORE_SPOT_WEIGHT` increases ore-spot face appearance chance |
| 2024 | 24 | COMMON | 광맥의 실루엣 I / Vein Silhouette I | 2022 | C4 | 3 | (1,-15) | `LANTERN_VEIN_WEIGHT` increases ore-vein face appearance chance |
| 2025 | 25 | RARE | 풍부한 반짝임 III / Rich Glimmer III | 2023 | C4 | 3 | (-2,-16) | `LANTERN_RICH_WEIGHT` increases rich-face appearance chance |
| 2026 | 26 | RARE | 희귀한 반사 III / Rare Reflection III | 2024 | C4 | 3 | (2,-16) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2027 | 27 | MAGIC | 광물 밀도 II / Ore Density II | 2025 | C4 | 3 | (-3,-17) | `LANTERN_ORE_DENSITY_CHANCE` chance for one additional ore slot when generating a face |
| 2028 | 28 | MAGIC | 빛의 보너스 II / Light Bonus II | 2026 | C4 | 3 | (3,-17) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2029 | 29 | COMMON | 숨은 주머니 I / Hidden Pocket I | 2027 | C4 | 3 | (-1,-18) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2030 | 30 | COMMON | 광석 승급 I / Ore Upgrade I | 2028 | C4 | 3 | (1,-18) | `LANTERN_ORE_UPGRADE_CHANCE` chance to upgrade one generated ore to a better valid ore in the layer |
| 2031 | 31 | RARE | 희귀 반짝임 III / Rare Glint III | 2029,2030 | C4 | 3 | (0,-19) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2032 | 32 | COMMON | 깊은 등불 I / Deep Lamp I | 2031 | C5 | 4 | (-2,-20) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2033 | 33 | UNIQUE | 철 랜턴 / Iron Lantern | 2031 | C5 | 4 | (2,-20) | `LANTERN_TIER_IRON` tier=iron, increases rich-face appearance chance |
| 2034 | 34 | COMMON | 광맥 희미한 빛 I / Ore Spot Glow I | 2032 | C5 | 4 | (-3,-21) | `LANTERN_ORE_SPOT_WEIGHT` increases ore-spot face appearance chance |
| 2035 | 35 | COMMON | 광맥의 실루엣 I / Vein Silhouette I | 2033 | C5 | 4 | (3,-21) | `LANTERN_VEIN_WEIGHT` increases ore-vein face appearance chance |
| 2036 | 36 | MAGIC | 풍부한 반짝임 II / Rich Glimmer II | 2034 | C5 | 4 | (-2,-22) | `LANTERN_RICH_WEIGHT` increases rich-face appearance chance |
| 2037 | 37 | MAGIC | 희귀한 반사 II / Rare Reflection II | 2035 | C5 | 4 | (2,-22) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2038 | 38 | RARE | 광물 밀도 III / Ore Density III | 2036 | C5 | 4 | (-1,-23) | `LANTERN_ORE_DENSITY_CHANCE` chance for one additional ore slot when generating a face |
| 2039 | 39 | RARE | 빛의 보너스 III / Light Bonus III | 2037 | C5 | 4 | (1,-23) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2040 | 40 | MAGIC | 숨은 주머니 II / Hidden Pocket II | 2038 | C6 | 5 | (-3,-24) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2041 | 41 | MAGIC | 광석 승급 II / Ore Upgrade II | 2039 | C6 | 5 | (3,-24) | `LANTERN_ORE_UPGRADE_CHANCE` chance to upgrade one generated ore to a better valid ore in the layer |
| 2042 | 42 | RARE | 희귀 광맥 확률 III / Rare Vein Chance III | 2040 | C6 | 5 | (-1,-25) | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2043 | 43 | RARE | 깊은 등불 III / Deep Lamp III | 2041,2042 | C6 | 5 | (1,-25) | `LANTERN_ORE_BONUS_CHANCE` increases chance for one extra same ore on ore gain |
| 2044 | 44 | UNIQUE | 수정 랜턴 / Crystal Lantern | 2043 | C6 | 5 | (-1,-26) | `LANTERN_TIER_CRYSTAL` tier=crystal, increases rare-vein appearance chance |
| 2045 | 45 | RARE | 다이아 조짐 III / Diamond Trace III | 2044 | C6 | Diamond Depth | d=28,o=1 | `LANTERN_RARE_WEIGHT` increases rare-vein appearance chance |
| 2046 | 46 | UNIQUE | 다이아 랜턴 / Diamond Lantern | 2045 | C6 | Diamond Depth | d=29,o=0 | `LANTERN_TIER_DIAMOND` tier=diamond, diamond ore appearance probability improves |
| 3000 | 0 | UNIQUE | 낡은 장갑 / Worn Gloves | 0 | C1 |  | (-1,0) | `GLOVES_BASE_UNLOCK` unlocks Gloves branch |
| 3001 | 1 | COMMON | 빠른 손놀림 I / Quick Hands I | 3000 | C1 |  | (-2,0) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3002 | 2 | COMMON | 시작 가속 I / Opening Acceleration I | 3001 | C1 |  | (-3,-1) | `GLOVES_OPENING_ACCELERATION_CHANCE` chance for faster opening hits after a new face appears |
| 3003 | 3 | COMMON | 균열 추적 I / Crack Tracking I | 3001 | C1 |  | (-3,1) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3004 | 4 | MAGIC | 회수 동작 II / Recovery Motion II | 3002 | C1 |  | (-4,-2) | `GLOVES_BREAK_RECOVERY_CHANCE` chance for faster next hit after a block breaks |
| 3005 | 5 | RARE | 잔해 정리 III / Debris Clear III | 3003 | C1 |  | (-4,2) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3006 | 6 | COMMON | 공명 파괴 I / Resonant Break I | 3004 | C1 |  | (-5,-1) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3007 | 7 | MAGIC | 빠른 손놀림 II / Quick Hands II | 3005 | C1 |  | (-5,1) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3008 | 8 | RARE | 공명 파괴 III / Resonant Break III | 3006,3007 | C2 | 1 | (-6,0) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3009 | 9 | COMMON | 균열 추적 I / Crack Tracking I | 3008 | C2 | 1 | (-7,-2) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3010 | 10 | COMMON | 잔해 정리 I / Debris Clear I | 3008 | C2 | 1 | (-7,2) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3011 | 11 | MAGIC | 빠른 손놀림 II / Quick Hands II | 3009 | C2 | 1 | (-8,-3) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3012 | 12 | UNIQUE | 돌 장갑 / Stone Gloves | 3010,3011 | C2 | 1 | (-8,3) | `GLOVES_TIER_STONE` tier=stone, base AUTO mining speed improves |
| 3013 | 13 | COMMON | 시작 가속 I / Opening Acceleration I | 3012 | C2 | 1 | (-9,-1) | `GLOVES_OPENING_ACCELERATION_CHANCE` chance for faster opening hits after a new face appears |
| 3014 | 14 | COMMON | 균열 추적 I / Crack Tracking I | 3012 | C2 | 1 | (-9,1) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3015 | 15 | MAGIC | 회수 동작 II / Recovery Motion II | 3013 | C2 | 1 | (-10,-2) | `GLOVES_BREAK_RECOVERY_CHANCE` chance for faster next hit after a block breaks |
| 3016 | 16 | RARE | 잔해 정리 III / Debris Clear III | 3014,3015 | C3 | 2 | (-10,2) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3017 | 17 | COMMON | 공명 파괴 I / Resonant Break I | 3016 | C3 | 2 | (-11,0) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3018 | 18 | MAGIC | 빠른 손놀림 II / Quick Hands II | 3017 | C3 | 2 | (-12,-2) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3019 | 19 | MAGIC | 공명 파괴 II / Resonant Break II | 3017 | C3 | 2 | (-12,2) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3020 | 20 | UNIQUE | 구리 장갑 / Copper Gloves | 3018,3019 | C3 | 2 | (-13,0) | `GLOVES_TIER_COPPER` tier=copper, opening acceleration and crack tracking improve |
| 3021 | 21 | COMMON | 균열 추적 I / Crack Tracking I | 3020 | C3 | 2 | (-14,-3) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3022 | 22 | COMMON | 잔해 정리 I / Debris Clear I | 3020 | C3 | 2 | (-14,3) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3023 | 23 | COMMON | 빠른 손놀림 I / Quick Hands I | 3021 | C3 | 2 | (-15,-1) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3024 | 24 | COMMON | 시작 가속 I / Opening Acceleration I | 3022 | C4 | 3 | (-15,1) | `GLOVES_OPENING_ACCELERATION_CHANCE` chance for faster opening hits after a new face appears |
| 3025 | 25 | RARE | 균열 추적 III / Crack Tracking III | 3023 | C4 | 3 | (-16,-2) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3026 | 26 | RARE | 회수 동작 III / Recovery Motion III | 3024 | C4 | 3 | (-16,2) | `GLOVES_BREAK_RECOVERY_CHANCE` chance for faster next hit after a block breaks |
| 3027 | 27 | MAGIC | 회수 동작 II / Recovery Motion II | 3025 | C4 | 3 | (-17,-3) | `GLOVES_BREAK_RECOVERY_CHANCE` chance for faster next hit after a block breaks |
| 3028 | 28 | MAGIC | 공명 파괴 II / Resonant Break II | 3026 | C4 | 3 | (-17,3) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3029 | 29 | COMMON | 빠른 손놀림 I / Quick Hands I | 3027 | C4 | 3 | (-18,-1) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3030 | 30 | COMMON | 균열 추적 I / Crack Tracking I | 3028 | C4 | 3 | (-18,1) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3031 | 31 | RARE | 잔해 정리 III / Debris Clear III | 3029,3030 | C4 | 3 | (-19,0) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3032 | 32 | COMMON | 시작 가속 I / Opening Acceleration I | 3031 | C5 | 4 | (-20,-2) | `GLOVES_OPENING_ACCELERATION_CHANCE` chance for faster opening hits after a new face appears |
| 3033 | 33 | UNIQUE | 철 장갑 / Iron Gloves | 3031 | C5 | 4 | (-20,2) | `GLOVES_TIER_IRON` tier=iron, break recovery and debris clear improve |
| 3034 | 34 | COMMON | 빠른 손놀림 I / Quick Hands I | 3032 | C5 | 4 | (-21,-3) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3035 | 35 | COMMON | 시작 가속 I / Opening Acceleration I | 3033 | C5 | 4 | (-21,3) | `GLOVES_OPENING_ACCELERATION_CHANCE` chance for faster opening hits after a new face appears |
| 3036 | 36 | MAGIC | 균열 추적 II / Crack Tracking II | 3034 | C5 | 4 | (-22,-2) | `GLOVES_CRACK_TRACKING_PRIORITY` AUTO prioritizes already damaged cells |
| 3037 | 37 | MAGIC | 회수 동작 II / Recovery Motion II | 3035 | C5 | 4 | (-22,2) | `GLOVES_BREAK_RECOVERY_CHANCE` chance for faster next hit after a block breaks |
| 3038 | 38 | RARE | 잔해 정리 III / Debris Clear III | 3036 | C5 | 4 | (-23,-1) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3039 | 39 | RARE | 공명 파괴 III / Resonant Break III | 3037 | C5 | 4 | (-23,1) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3040 | 40 | MAGIC | 빠른 손놀림 II / Quick Hands II | 3038 | C6 | 5 | (-24,-3) | `GLOVES_HIT_INTERVAL_REDUCTION` increases AUTO mining speed |
| 3041 | 41 | MAGIC | 공명 파괴 II / Resonant Break II | 3039 | C6 | 5 | (-24,3) | `GLOVES_RESONANT_BREAK_CHANCE` chance to crack adjacent cells through hand resonance |
| 3042 | 42 | RARE | 잔해 정리 III / Debris Clear III | 3040 | C6 | 5 | (-25,-1) | `GLOVES_DEBRIS_CLEAR_SPEED` reduces face advance transition time after a face is cleared |
| 3043 | 43 | RARE | 시작 가속 III / Opening Acceleration III | 3041,3042 | C6 | 5 | (-25,1) | `GLOVES_OPENING_ACCELERATION_CHANCE` chance for faster opening hits after a new face appears |
| 3044 | 44 | UNIQUE | 수정 장갑 / Crystal Gloves | 3043 | C6 | 5 | (-26,-1) | `GLOVES_TIER_CRYSTAL` tier=crystal, resonant break and debris clear improve |
| 3045 | 45 | RARE | 공명 파괴 III / Resonant Break III | 3044 | C6 | Diamond Depth | d=28,o=1 | `GLOVES_RESONANT_BREAK_CHANCE` final bridge, adjacent resonance crack chance |
| 3046 | 46 | UNIQUE | 다이아 장갑 / Diamond Gloves | 3045 | C6 | Diamond Depth | d=29,o=0 | `GLOVES_TIER_DIAMOND` tier=diamond, capstone hand-work boost |
| 4000 | 0 | UNIQUE | 깊은 코어 / Deep Core | 0 | C1 |  | (0,1) | `DEEP_CORE_BASE_UNLOCK` unlocks Deep Core branch |
| 4001 | 1 | COMMON | 채굴 잔재 I / Mining Residue I | 4000 | C1 |  | (0,2) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4002 | 2 | COMMON | 방치 채굴 I / Idle Mining I | 4001 | C1 |  | (-1,3) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4003 | 3 | COMMON | 자동 심도 I / Auto Depth I | 4001 | C1 |  | (1,3) | `DEEP_CORE_OFFLINE_DEPTH_CAP` increases offline depth progress cap |
| 4004 | 4 | MAGIC | 시작 균열 II / Starting Fracture II | 4002 | C1 |  | (-2,4) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4005 | 5 | RARE | 발견 예감 III / Discovery Sense III | 4003 | C1 |  | (2,4) | `DEEP_CORE_REWARD_QUALITY` increases better reward choice appearance chance |
| 4006 | 6 | COMMON | 동반 발견 I / Companion Find I | 4004 | C1 |  | (-1,5) | `DEEP_CORE_MATERIAL_FIND_CHANCE` chance for one secondary material line in MATERIAL rewards |
| 4007 | 7 | MAGIC | 심층 잔재 II / Deep Residue II | 4005 | C1 |  | (1,5) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4008 | 8 | RARE | 장기 채굴 III / Long Digging III | 4006,4007 | C2 | 1 | (0,6) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4009 | 9 | COMMON | 채굴 잔재 I / Mining Residue I | 4008 | C2 | 1 | (-2,7) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4010 | 10 | COMMON | 동반 발견 I / Companion Find I | 4008 | C2 | 1 | (2,7) | `DEEP_CORE_MATERIAL_FIND_CHANCE` chance for one secondary material line in MATERIAL rewards |
| 4011 | 11 | MAGIC | 채굴 잔재 II / Mining Residue II | 4009 | C2 | 1 | (-3,8) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4012 | 12 | UNIQUE | 돌 코어 / Stone Core | 4010,4011 | C2 | 1 | (3,8) | `DEEP_CORE_TIER_STONE` tier=stone, improves starting-fracture chance |
| 4013 | 13 | COMMON | 방치 채굴 I / Idle Mining I | 4012 | C2 | 1 | (-1,9) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4014 | 14 | COMMON | 자동 심도 I / Auto Depth I | 4012 | C2 | 1 | (1,9) | `DEEP_CORE_OFFLINE_DEPTH_CAP` increases offline depth progress cap |
| 4015 | 15 | MAGIC | 동반 발견 II / Companion Find II | 4013 | C2 | 1 | (-2,10) | `DEEP_CORE_MATERIAL_FIND_CHANCE` chance for one secondary material line in MATERIAL rewards |
| 4016 | 16 | RARE | 발견 예감 III / Discovery Sense III | 4014,4015 | C3 | 2 | (2,10) | `DEEP_CORE_REWARD_QUALITY` increases better reward choice appearance chance |
| 4017 | 17 | COMMON | 시작 균열 I / Starting Fracture I | 4016 | C3 | 2 | (0,11) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4018 | 18 | MAGIC | 심층 잔재 II / Deep Residue II | 4017 | C3 | 2 | (-2,12) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4019 | 19 | MAGIC | 장기 채굴 II / Long Digging II | 4017 | C3 | 2 | (2,12) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4020 | 20 | UNIQUE | 석탄 코어 / Coal Core | 4018,4019 | C3 | 2 | (0,13) | `DEEP_CORE_TIER_COAL` tier=coal, improves offline mining chance/limit |
| 4021 | 21 | COMMON | 시작 균열 I / Starting Fracture I | 4020 | C3 | 2 | (-3,14) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4022 | 22 | COMMON | 동반 발견 I / Companion Find I | 4020 | C3 | 2 | (3,14) | `DEEP_CORE_MATERIAL_FIND_CHANCE` chance for one secondary material line in MATERIAL rewards |
| 4023 | 23 | COMMON | 채굴 잔재 I / Mining Residue I | 4021 | C3 | 2 | (-1,15) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4024 | 24 | COMMON | 방치 채굴 I / Idle Mining I | 4022 | C4 | 3 | (1,15) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4025 | 25 | RARE | 자동 심도 III / Auto Depth III | 4023 | C4 | 3 | (-2,16) | `DEEP_CORE_OFFLINE_DEPTH_CAP` increases offline depth progress cap |
| 4026 | 26 | RARE | 시작 균열 III / Starting Fracture III | 4024 | C4 | 3 | (2,16) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4027 | 27 | MAGIC | 발견 예감 II / Discovery Sense II | 4025 | C4 | 3 | (-3,17) | `DEEP_CORE_REWARD_QUALITY` increases better reward choice appearance chance |
| 4028 | 28 | MAGIC | 동반 발견 II / Companion Find II | 4026 | C4 | 3 | (3,17) | `DEEP_CORE_MATERIAL_FIND_CHANCE` chance for one secondary material line in MATERIAL rewards |
| 4029 | 29 | COMMON | 심층 잔재 I / Deep Residue I | 4027 | C4 | 3 | (-1,18) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4030 | 30 | COMMON | 장기 채굴 I / Long Digging I | 4028 | C4 | 3 | (1,18) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4031 | 31 | RARE | 발견 예감 III / Discovery Sense III | 4029,4030 | C4 | 3 | (0,19) | `DEEP_CORE_REWARD_QUALITY` increases better reward choice appearance chance |
| 4032 | 32 | COMMON | 시작 균열 I / Starting Fracture I | 4031 | C5 | 4 | (-2,20) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4033 | 33 | UNIQUE | 철 코어 / Iron Core | 4031 | C5 | 4 | (2,20) | `DEEP_CORE_TIER_IRON` tier=iron, improves extra-material chance |
| 4034 | 34 | COMMON | 채굴 잔재 I / Mining Residue I | 4032 | C5 | 4 | (-3,21) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4035 | 35 | COMMON | 방치 채굴 I / Idle Mining I | 4033 | C5 | 4 | (3,21) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4036 | 36 | MAGIC | 자동 심도 II / Auto Depth II | 4034 | C5 | 4 | (-2,22) | `DEEP_CORE_OFFLINE_DEPTH_CAP` increases offline depth progress cap |
| 4037 | 37 | MAGIC | 시작 균열 II / Starting Fracture II | 4035 | C5 | 4 | (2,22) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4038 | 38 | RARE | 발견 예감 III / Discovery Sense III | 4036 | C5 | 4 | (-1,23) | `DEEP_CORE_REWARD_QUALITY` increases better reward choice appearance chance |
| 4039 | 39 | RARE | 동반 발견 III / Companion Find III | 4037 | C5 | 4 | (1,23) | `DEEP_CORE_MATERIAL_FIND_CHANCE` chance for one secondary material line in MATERIAL rewards |
| 4040 | 40 | MAGIC | 심층 잔재 II / Deep Residue II | 4038 | C6 | 5 | (-3,24) | `DEEP_CORE_EXTRA_MATERIAL_CHANCE` chance for one extra same resource on mining gain |
| 4041 | 41 | MAGIC | 장기 채굴 II / Long Digging II | 4039 | C6 | 5 | (3,24) | `DEEP_CORE_OFFLINE_EFFICIENCY` increases offline mining efficiency |
| 4042 | 42 | RARE | 발견 예감 III / Discovery Sense III | 4040 | C6 | 5 | (-1,25) | `DEEP_CORE_REWARD_QUALITY` increases better reward choice appearance chance |
| 4043 | 43 | RARE | 시작 균열 III / Starting Fracture III | 4041,4042 | C6 | 5 | (1,25) | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4044 | 44 | UNIQUE | 수정 코어 / Crystal Core | 4043 | C6 | 5 | (-1,26) | `DEEP_CORE_TIER_CRYSTAL` tier=crystal, improves reward quality chance |
| 4045 | 45 | RARE | 문턱 균열 III / Threshold Fracture III | 4044 | C6 | Diamond Depth | d=28,o=1 | `DEEP_CORE_STARTING_FRACTURE_CHANCE` chance for next face to start with one pre-cracked cell |
| 4046 | 46 | UNIQUE | 엔드리스 문 / Endless Gate | 4045 | C6 | Diamond Depth | d=29,o=0 | `DEEP_CORE_ENDLESS_TAB_OPEN` opens Endless Core tab |
