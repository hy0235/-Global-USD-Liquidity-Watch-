
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Indicator, Language } from '../types';

interface BubbleMapProps {
  onshore: Indicator[];
  offshore: Indicator[];
  onSelect: (indicator: Indicator) => void;
  selectedId?: string;
  lang: Language;
}

const getLinks = (nodes: any[]) => {
  const links: { source: string; target: string; strength: number }[] = [];
  const addLink = (sourceCode: string, targetCode: string, strength: number = 1) => {
    const source = nodes.find(n => n.code === sourceCode);
    const target = nodes.find(n => n.code === targetCode);
    if (source && target) {
      links.push({ source: source.id, target: target.id, strength });
    }
  };

  // --- Onshore Connections ---
  addLink('TGA', 'ON RRP', 0.8);
  addLink('TGA', 'WALCL', 0.5);
  addLink('ON RRP', 'WALCL', 0.5);
  addLink('ON RRP', 'SOFR', 0.7);
  addLink('SOFR', 'Repo-IORB', 0.9);
  addLink('SOFR', 'EFFR', 0.6);
  addLink('UST Basis', 'Lev Shorts', 0.9);
  addLink('UST Basis', 'Imp Repo', 0.8);
  addLink('Imp Repo', 'SOFR', 0.5);

  // --- Offshore Connections ---
  addLink('USDJPY', 'JP10Y', 0.9);
  addLink('USDJPY', 'BOJ Rate', 0.7);
  addLink('JP10Y', 'BOJ Rate', 0.8);
  addLink('Eurodollars', 'Offshore Credit', 0.6);
  
  // --- Cross-Border Connections ---
  addLink('EURCBS 3M', 'Eurodollars', 0.7);
  addLink('JPYCBS 3M', 'USDJPY', 0.6);
  addLink('JPYCBS 3M', 'JP10Y', 0.4);
  addLink('Swap Lines', 'EURCBS 3M', 0.5);

  return links;
};

const BubbleMap: React.FC<BubbleMapProps> = ({ onshore, offshore, onSelect, selectedId, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [data] = useState(() => {
    const combinedNodes = [
      ...onshore.map(i => ({ ...i, group: 'onshore' })), 
      ...offshore.map(i => ({ ...i, group: 'offshore' }))
    ];
    return {
      nodes: combinedNodes,
      links: getLinks(combinedNodes)
    };
  });

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = 600;
    
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; background-color: #0F1115;"); // Dark background like bubblemaps.io

    // --- Simulation ---
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(120)) // Longer links for cleaner look
      .force("charge", d3.forceManyBody().strength(-600)) // Stronger repulsion to prevent overlap
      .force("collide", d3.forceCollide().radius((d: any) => getSize(d.weight) + 15).iterations(2))
      .force("x", d3.forceX((d: any) => d.group === 'onshore' ? width * 0.35 : width * 0.65).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.08));

    // --- Aesthetics (Solid Colors & Strokes) ---
    // Onshore: Cyan/Blue
    const colorOnshoreFill = "#1e3a8a"; // Dark Blue
    const colorOnshoreStroke = "#60A5FA"; // Bright Blue

    // Offshore: Purple/Pink
    const colorOffshoreFill = "#4c1d95"; // Dark Purple
    const colorOffshoreStroke = "#C084FC"; // Bright Purple

    const colorSelectedFill = "#b45309"; // Dark Amber
    const colorSelectedStroke = "#FBBF24"; // Bright Amber

    // --- Drawing ---

    // 1. Links
    const link = svg.append("g")
      .attr("stroke", "#374151") // Dark grey lines
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 1);

    // 2. Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
          onSelect(d as unknown as Indicator);
          event.stopPropagation();
      });

    // Bubble Circle (Main)
    node.append("circle")
      .attr("r", (d: any) => getSize(d.weight))
      .attr("fill", (d: any) => {
          if (d.id === selectedId) return colorSelectedFill;
          return d.group === 'onshore' ? colorOnshoreFill : colorOffshoreFill;
      })
      .attr("stroke", (d: any) => {
          if (d.id === selectedId) return colorSelectedStroke;
          return d.group === 'onshore' ? colorOnshoreStroke : colorOffshoreStroke;
      })
      .attr("stroke-width", 3) // Thicker stroke for that 'token' look
      .attr("stroke-opacity", 0.9)
      .transition().duration(300);

    // Code Label
    node.append("text")
      .text((d: any) => d.code)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "#ffffff")
      .attr("font-weight", "600")
      .attr("font-family", "Inter, sans-serif")
      .attr("font-size", (d: any) => Math.min(getSize(d.weight) / 2, 14))
      .style("pointer-events", "none");

    // Value Label
    node.append("text")
      .text((d: any) => d.currentValue)
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "#cbd5e1") // Slate-300
      .attr("font-size", (d: any) => Math.min(getSize(d.weight) / 2.5, 11))
      .style("pointer-events", "none");

    // --- Update positions ---
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [data, selectedId]);

  const getSize = (weight: number) => {
    return 35 + (weight * 4.5); 
  };

  const labelOnshore = lang === 'zh' ? "在岸 (Onshore)" : "Onshore";
  const labelOffshore = lang === 'zh' ? "离岸 (Offshore)" : "Offshore";

  return (
    <div ref={wrapperRef} className="w-full bg-[#0F1115] rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-4 pointer-events-none">
            <div className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded-full border border-gray-700 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div>
                <span className="text-xs text-gray-200 font-medium">{labelOnshore}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded-full border border-gray-700 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-[#C084FC]"></div>
                <span className="text-xs text-gray-200 font-medium">{labelOffshore}</span>
            </div>
        </div>
        
        <div className="absolute bottom-4 right-4 z-10 text-[10px] text-gray-500 pointer-events-none">
            Interactive Force Graph • Powered by D3
        </div>

        <svg ref={svgRef} className="w-full h-[600px] block"></svg>
    </div>
  );
};

export default BubbleMap;
