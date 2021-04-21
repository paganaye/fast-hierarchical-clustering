import { expect } from 'chai';
import { FasterQuadTree, PointEx, QuadNode, Quarter } from '../src/faster/FasterQuadTree';
import { Sibling, Siblings } from '../src/faster/Siblings';
import { Point } from '../src/Point';


describe('Siblings', function () {
  it('gives sensible values', function () {

    let quad = new FasterQuadTree(3);
    let letter = 65;
    let points: Point[] = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        let newPoint = new PointEx((2 * x + 1) / 8, (2 * y + 1) / 8, String.fromCharCode(letter++));
        points.push(newPoint);
        quad.insert(newPoint)
      }
    }
    //       +---+---+---+---+
    //       | A | B | C | D |
    //       +---+---+---+---+
    //       | E | F | G | H |
    //       +---+---+---+---+
    //       | I | J | K | L |
    //       +---+---+---+---+
    //       | M | N | O | P |
    //       +---+---+---+---+


    for (let s of quad.forEachSiblings()) {
      let n = s.node!;
      if (!n || !n.points) continue;
      let tag = n.points[0]!.tag;
      switch (tag) {
        case "A":
          expectSiblingsToEq(s, "--- -AB -EF");
          break;
        case "B":
          expectSiblingsToEq(s, "--- ABC EFG");
          break;
        case "C":
          expectSiblingsToEq(s, "--- BCD FGH");
          break;
        case "D":
          expectSiblingsToEq(s, "--- CD- GH-");
          break;
        case "E":
          expectSiblingsToEq(s, "-AB -EF -IJ");
          break;
        case "F":
          expectSiblingsToEq(s, "ABC EFG IJK");
          break;
        case "G":
          expectSiblingsToEq(s, "BCD FGH JKL");
          break;
        case "H":
          expectSiblingsToEq(s, "CD- GH- KL-");
          break;
        case "I":
          expectSiblingsToEq(s, "-EF -IJ -MN");
          break;
        case "J":
          expectSiblingsToEq(s, "EFG IJK MNO");
          break;
        case "K":
          expectSiblingsToEq(s, "FGH JKL NOP");
          break;
        case "L":
          expectSiblingsToEq(s, "GH- KL- OP-");
          break;
        case "M":
          expectSiblingsToEq(s, "-IJ -MN ---");
          break;
        case "N":
          expectSiblingsToEq(s, "IJK MNO ---");
          break;
        case "O":
          expectSiblingsToEq(s, "JKL NOP ---");
          break;
        case "P":
          expectSiblingsToEq(s, "KL- OP- ---");
          break;
      }
    }

  });
});


function siblingsString(s?: Siblings): string {
  return (s && s.node && s.node.points && s.node.points.length == 1) ? (s.node.points[0].tag || '?') : '-';
}

function expectSiblingsToEq(siblings: Siblings, expected: string) {
  expect(siblingsString(siblings.getSibling(Sibling.TopLeft))).to.eq(expected[0], "topleft of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.Top))).to.eq(expected[1], "top of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.TopRight))).to.eq(expected[2], "topright of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.Left))).to.eq(expected[4], "left of " + expected);
  expect(siblingsString(siblings)).to.eq(expected[5], "center of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.Right))).to.eq(expected[6], "right of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.BottomLeft))).to.eq(expected[8], "bottomleft of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.Bottom))).to.eq(expected[9], "bottom of " + expected);
  expect(siblingsString(siblings.getSibling(Sibling.BottomRight))).to.eq(expected[10], "bottomright of " + expected);
}
