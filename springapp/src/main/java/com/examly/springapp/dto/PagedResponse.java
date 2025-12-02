// package com.examly.springapp.dto;

// import lombok.AllArgsConstructor;
// import lombok.Data;

// import java.util.List;

// @Data
// @AllArgsConstructor
// public class PagedResponse<T> {
//     private List<T> content;
//     private long totalElements;
//     private int page;
//     private int size;
//     private int totalPages;
// }


package com.examly.springapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> content;
    private long totalElements;
    private int page;
    private int size;
    private int totalPages;
}
