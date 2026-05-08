package se.migrationsverket.ihpservice.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreeUpdateNode implements Comparable<TreeUpdateNode>{
    Integer id;
    String nodeName;
    Integer partialPath;

    @Override
    public int compareTo(@NotNull TreeUpdateNode o) {
        return this.partialPath - o.partialPath;
    }

}
