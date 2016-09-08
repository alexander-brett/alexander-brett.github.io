// HEXAGONAL GEOMETRY (KINDA)

// A ring is a concentric hexagon
// A side is which side of the hexagon you're on
// An offset is where you are on that side

function getAt(ring, side, offset){
  return ring === 0 ? 0 : 1 + 3*ring*(ring-1) + side*ring + offset;
}

function firstInRing(r){ return getAt(r, 0, 0); }

function lastInRing(r){ return getAt(r, 5, r-1); }

function getAdjacent(ring,side,offset) {
  // this is the centre
  if (ring === 0) { return [1,2,3,4,5,6] }
  if (offset === 0 && side === 0) { // this is the first node in this ring
    return [
        firstInRing(ring) + 1, // the next node (above and to the left)
        firstInRing(ring - 1), // the first node in the previous ring (left)
        firstInRing(ring+1),  // the first node in the next ring (right)
        lastInRing(ring), // the last node in this ring (below-left)
        firstInRing(ring+1) + 1, // the second node in the next ring (above-right)
        lastInRing(ring+1) // the last node in the next ring (below-right)
      ];
    }
    // this is the last node in the first ring
    // this is a special case because it's the only
    // last node which is also a corner node
    if (ring === 1 && side === 5){ return [0,1,5,18,17,16]; }
    // this is the last node in a ring
    if (side === 5 && offset === ring - 1) { // then i = 3*r*(r+1)
      return [
        lastInRing(ring) - 1, // the previous node (below and to the left)
        lastInRing(ring+1), // the last node in the next ring (right)
        lastInRing(ring+1)-1,// the penultimate node in the next ring (below-right)
        lastInRing(ring-1),// the last node in the previous ring (left)
        firstInRing(ring-1),// the first node in the previous ring (above-left)
        firstInRing(ring)// the first node in this ring (above-right)
      ]
    }
    if (offset === 0){
      return [
        getAt(ring, side, 1), // next (left)
        getAt(ring, side-1, ring-1),// previous (below-right)
        getAt(ring-1, side, 0),// inside same corner (below-left)
        getAt(ring+1, side, 0),// outside same corter (above-right)
        getAt(ring+1, side-1, ring),// outside same corner minus 1 (right)
        getAt(ring+1, side, 1)// outside same corner plus 1 (above-left)
      ];
    }
    return [
      getAt(ring, side, offset+1),
      getAt(ring, side, offset-1),
      getAt(ring+1, side, offset),
      getAt(ring+1, side, offset+1),
      getAt(ring-1, side, offset),
      getAt(ring-1, side, offset-1),
    ];
}
