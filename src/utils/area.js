// /^\d+00$/g
const areas = [
  {
    name: '杭州市',
    code: '330100',
    children: [
      { name: '上城区', code: '330102' },
      { name: '下城区', code: '330103' },
      { name: '江干区', code: '330104' },
      { name: '拱墅区', code: '330105' },
      { name: '西湖区', code: '330106' },
      { name: '滨江区', code: '330108' },
      { name: '萧山区', code: '330109' },
      { name: '余杭区', code: '330110' },
      { name: '富阳区', code: '330111' },
      { name: '临安区', code: '330112' },
      { name: '桐庐县', code: '330122' },
      { name: '淳安县', code: '330127' },
      { name: '建德市', code: '330182' },
    ],
  },
  {
    name: '宁波市',
    code: '330200',
    children: [
      { name: '海曙区', code: '330203' },
      { name: '江北区', code: '330205' },
      { name: '北仑区', code: '330206' },
      { name: '镇海区', code: '330211' },
      { name: '鄞州区', code: '330212' },
      { name: '奉化区', code: '330213' },
      { name: '象山县', code: '330225' },
      { name: '宁海县', code: '330226' },
      { name: '余姚市', code: '330281' },
      { name: '慈溪市', code: '330282' },
    ],
  },
  {
    name: '温州市',
    code: '330300',
    children: [
      { name: '鹿城区', code: '330302' },
      { name: '龙湾区', code: '330303' },
      { name: '瓯海区', code: '330304' },
      { name: '洞头区', code: '330305' },
      { name: '永嘉县', code: '330324' },
      { name: '平阳县', code: '330326' },
      { name: '苍南县', code: '330327' },
      { name: '文成县', code: '330328' },
      { name: '泰顺县', code: '330329' },
      { name: '瑞安市', code: '330381' },
      { name: '乐清市', code: '330382' },
      { name: '龙港市', code: '330383' },
    ],
  },
  {
    name: '嘉兴市',
    code: '330400',
    children: [
      { name: '南湖区', code: '330402' },
      { name: '秀洲区', code: '330411' },
      { name: '嘉善县', code: '330421' },
      { name: '海盐县', code: '330424' },
      { name: '海宁市', code: '330481' },
      { name: '平湖市', code: '330482' },
      { name: '桐乡市', code: '330483' },
    ],
  },
  {
    name: '湖州市',
    code: '330500',
    children: [
      { name: '吴兴区', code: '330502' },
      { name: '南浔区', code: '330503' },
      { name: '德清县', code: '330521' },
      { name: '长兴县', code: '330522' },
      { name: '安吉县', code: '330523' },
    ],
  },
  {
    name: '绍兴市',
    code: '330600',
    children: [
      { name: '越城区', code: '330602' },
      { name: '柯桥区', code: '330603' },
      { name: '上虞区', code: '330604' },
      { name: '新昌县', code: '330624' },
      { name: '诸暨市', code: '330681' },
      { name: '嵊州市', code: '330683' },
    ],
  },
  {
    name: '金华市',
    code: '330700',
    children: [
      { name: '婺城区', code: '330702' },
      { name: '金东区', code: '330703' },
      { name: '武义县', code: '330723' },
      { name: '浦江县', code: '330726' },
      { name: '磐安县', code: '330727' },
      { name: '兰溪市', code: '330781' },
      { name: '义乌市', code: '330782' },
      { name: '东阳市', code: '330783' },
      { name: '永康市', code: '330784' },
    ],
  },
  {
    name: '衢州市',
    code: '330800',
    children: [
      { name: '柯城区', code: '330802' },
      { name: '衢江区', code: '330803' },
      { name: '常山县', code: '330822' },
      { name: '开化县', code: '330824' },
      { name: '龙游县', code: '330825' },
      { name: '江山市', code: '330881' },
    ],
  },
  {
    name: '舟山市',
    code: '330900',
    children: [
      { name: '定海区', code: '330902' },
      { name: '普陀区', code: '330903' },
      { name: '岱山县', code: '330921' },
      { name: '嵊泗县', code: '330922' },
    ],
  },
  {
    name: '台州市',
    code: '331000',
    children: [
      { name: '椒江区', code: '331002' },
      { name: '黄岩区', code: '331003' },
      { name: '路桥区', code: '331004' },
      { name: '三门县', code: '331022' },
      { name: '天台县', code: '331023' },
      { name: '仙居县', code: '331024' },
      { name: '温岭市', code: '331081' },
      { name: '临海市', code: '331082' },
      { name: '玉环市', code: '331083' },
    ],
  },
  {
    name: '丽水市',
    code: '331100',
    children: [
      { name: '莲都区', code: '331102' },
      { name: '青田县', code: '331121' },
      { name: '缙云县', code: '331122' },
      { name: '遂昌县', code: '331123' },
      { name: '松阳县', code: '331124' },
      { name: '云和县', code: '331125' },
      { name: '庆元县', code: '331126' },
      { name: '景宁畲族自治县', code: '331127' },
      { name: '龙泉市', code: '331181' },
    ],
  },
];

export const codeMap = {};
areas.forEach(v => {
  codeMap[v.code] = v.name;
  v.children.forEach(o => {
    codeMap[o.code] = o.name;
  });
});

export const subCodeMap = {};
areas.forEach(v => {
  v.children.forEach(o => {
    subCodeMap[o.code] = 0;
  });
});

export const outAreas = [
  {
    name: '浙江省',
    code: '330000',
    children: areas,
  },
];

export const renderAreaLayer = origin => {
  const code = origin + '';
  if (code && !/^\d+00$/.test(code)) {
    return (
      <span>
        {`浙江省 / ${codeMap[code.slice(0, 4) + '00']} / `}
        <span style={{ fontColor: '#000000d9', fontWeight: 'bold' }}>{codeMap[code]}</span>
      </span>
    );
  }
  return null;
};

export const renderAreaArray = origin => {
  const code = origin + '';
  if (code && !/^\d+00$/.test(code)) {
    return ['330000',code.slice(0, 4) + '00',code];
  }
  return null;
};

export default areas;
