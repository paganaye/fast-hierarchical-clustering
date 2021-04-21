import { QuadNode, Quarter } from './FasterQuadTree';

export enum Sibling {
    TopLeft,
    Top,
    TopRight,
    Left,
    Right,
    BottomLeft,
    Bottom,
    BottomRight
}

export class Siblings {
    private constructor(
        readonly parent: Siblings | undefined,
        readonly node: QuadNode) {

        if (!parent || !parent.node || !node) {
            return;
        }
    }

    getSibling(sibling: Sibling): Siblings | undefined {
        switch (sibling) {
            case Sibling.TopLeft:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getSibling(Sibling.TopLeft)?.getQuarter(Quarter.BottomRight);
                    case Quarter.TopRight:
                        return this.parent?.getSibling(Sibling.Top)?.getQuarter(Quarter.BottomLeft);
                    case Quarter.BottomLeft:
                        return this.parent?.getSibling(Sibling.Left)?.getQuarter(Quarter.TopRight);
                    case Quarter.BottomRight:
                        return this.parent?.getQuarter(Quarter.TopLeft);
                }
                break;
            case Sibling.Top:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getSibling(Sibling.Top)?.getQuarter(Quarter.BottomLeft);
                    case Quarter.TopRight:
                        return this.parent?.getSibling(Sibling.Top)?.getQuarter(Quarter.BottomRight);
                    case Quarter.BottomLeft:
                        return this.parent?.getQuarter(Quarter.TopLeft);
                    case Quarter.BottomRight:
                        return this.parent?.getQuarter(Quarter.TopRight);
                }
                break;
            case Sibling.TopRight:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getSibling(Sibling.Top)?.getQuarter(Quarter.BottomRight);
                    case Quarter.TopRight:
                        return this.parent?.getSibling(Sibling.TopRight)?.getQuarter(Quarter.BottomLeft);
                    case Quarter.BottomLeft:
                        return this.parent?.getQuarter(Quarter.TopRight);
                    case Quarter.BottomRight:
                        return this.parent?.getSibling(Sibling.Right)?.getQuarter(Quarter.TopLeft); 
                }
                break;
            case Sibling.Left:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getSibling(Sibling.Left)?.getQuarter(Quarter.TopRight);
                    case Quarter.TopRight:
                        return this.parent?.getQuarter(Quarter.TopLeft);
                    case Quarter.BottomLeft:
                        return this.parent?.getSibling(Sibling.Left)?.getQuarter(Quarter.BottomRight); 
                    case Quarter.BottomRight:
                        return this.parent?.getQuarter(Quarter.BottomLeft);
                }
                break;
            case Sibling.Right:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getQuarter(Quarter.TopRight);
                    case Quarter.TopRight:
                        return this.parent?.getSibling(Sibling.Right)?.getQuarter(Quarter.TopLeft);
                    case Quarter.BottomLeft:
                        return this.parent?.getQuarter(Quarter.BottomRight);
                    case Quarter.BottomRight:
                        return this.parent?.getSibling(Sibling.Right)?.getQuarter(Quarter.BottomLeft);
                }
                break;
            case Sibling.BottomLeft:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getSibling(Sibling.Left)?.getQuarter(Quarter.BottomRight);
                    case Quarter.TopRight:
                        return this.parent?.getQuarter(Quarter.BottomLeft);
                    case Quarter.BottomLeft:
                        return this.parent?.getSibling(Sibling.BottomLeft)?.getQuarter(Quarter.TopRight); 
                    case Quarter.BottomRight:
                        return this.parent?.getSibling(Sibling.Bottom)?.getQuarter(Quarter.TopLeft); 
                }
                break;
            case Sibling.Bottom:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getQuarter(Quarter.BottomLeft);
                    case Quarter.TopRight:
                        return this.parent?.getQuarter(Quarter.BottomRight);
                    case Quarter.BottomLeft:
                        return this.parent?.getSibling(Sibling.Bottom)?.getQuarter(Quarter.TopLeft); 
                    case Quarter.BottomRight:
                        return this.parent?.getSibling(Sibling.Bottom)?.getQuarter(Quarter.TopRight); 
                }
                break;
            case Sibling.BottomRight:
                switch (this.node.quarter) {
                    case Quarter.TopLeft:
                        return this.parent?.getQuarter(Quarter.BottomRight);                        
                    case Quarter.TopRight:
                        return this.parent?.getSibling(Sibling.Right)?.getQuarter(Quarter.BottomLeft);                        
                    case Quarter.BottomLeft:
                        return this.parent?.getSibling(Sibling.Bottom)?.getQuarter(Quarter.TopRight); 
                    case Quarter.BottomRight:
                        return this.parent?.getSibling(Sibling.BottomRight)?.getQuarter(Quarter.TopLeft); 
                }
                break;
        }
        return undefined;
    }

    static forRoot(node: QuadNode): Siblings {
        return new Siblings(undefined, node);
    }

    getQuarter(quarter: Quarter): Siblings | undefined {
        if (this.node) {
            let node: QuadNode | undefined;
            switch (quarter) {
                case Quarter.TopLeft: node = this.node.topLeft; break;
                case Quarter.TopRight: node = this.node.topRight; break;
                case Quarter.BottomLeft: node = this.node.bottomLeft; break;
                case Quarter.BottomRight: node = this.node.bottomRight; break;
            }
            if (node) {
                return new Siblings(this, node);
            }
        }
    }

    getNode(sibling: Sibling): QuadNode | undefined {
        return this.getSibling(sibling)?.node;
    }
}
