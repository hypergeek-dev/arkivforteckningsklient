package se.migrationsverket.ihpservice.api.rest.v1.dto;

public enum NodeName {
    CSNODE("csnode"),
    DOCUMENTNODE("documentnode"),
    ISSUENODE("issuenode"),
    OANODE("oanode"),
    PGNODE("pgnode"),
    PROCESSNODE("processnode");

    public final String value;

    NodeName(String value) {
        this.value = value;
    }

    public static NodeName getNodename(String value) {
        for (NodeName nn : values()) {
            if (value.equalsIgnoreCase(nn.getValue())) {
                return nn;
            }
        }
        throw new IllegalArgumentException("Inte ett giltigt nod namn");
    }

    public static boolean validDrop(NodeName droppedNode, NodeName toParent) {
        if (droppedNode.equals(PGNODE)) {
            return toParent.equals(OANODE) || toParent.equals(PGNODE);
        } else if (droppedNode.equals(PROCESSNODE)) {
            return toParent.equals(OANODE) || toParent.equals(PGNODE);
        } else if (droppedNode.equals(ISSUENODE)) {
            return toParent.equals(PROCESSNODE);
        } else if (droppedNode.equals(DOCUMENTNODE)) {
            return toParent.equals(ISSUENODE);
        }
        return false;
    }

    public String getValue() {
        return value;
    }

}
