# 执行多重比较

fun_mulcomp_hsd <- function(formula, data, ...){

    lrm <- lm(formula, data = data)
    f <- formula
    trt <- as.character(f[[3]])
    trt <- trt [! trt %in% c("+", "*")]
    
    hsd <- agricolae::HSD.test(
        lrm, 
        trt = trt, 
        ...)
    
    # 也可以使用其它方法
    # lsd <- agricolae::LSD.test(
    #     lrm, 
    #     trt = trt, 
    #     p.adj = "bonferroni",
    #     ...)
    
    res <- merge(cbind(treat = rownames(hsd$mean),
                       hsd$mean),
                 cbind(treat = rownames(hsd$groups),
                       hsd$groups),
                 sort = FALSE)
    return(res)
}

# 因素内比较

fun_mulcomp_hsd2 <- function(y, data, trts = trts, ...){
    
    if(length(trts) != 2) stop("can only deal with two factors")
    
    res <- vector(mode = "list", length = 2L)
    
    for (i in 1:length(trts)){
        k <- levels(data[,trts[i]])
        
        for (j in 1:length(k)){
            # dt <- base::subset(data, subset = list(trts[i] == k[j]))
            dt <- data[data[,trts[i]] %in% k[j], ]
            fm <- as.formula(paste0(y, " ~ ", trts[-i]))
            res[[i]][[j]] <- fun_mulcomp_hsd(fm, dt, ...)
            res[[i]][[j]] <- cbind("iGroup" = rep(k[j], nrow(res[[i]][[j]])), 
                                   res[[i]][[j]])
        }
        names(res[[i]]) <- k
    }
    names(res) <- trts
    return(res)
}

# 提取结果和表示显著性差异的字母标识

fun_mulcomp_res <- function(comp_list, treats = NULL, groups){
    
    if (! is.null(treats)){
        comp_list <- lapply(
            comp_list, 
            function(d) do.call(rbind, d[[treats]]))
    }
    
    res <- Map(
        function(x, y) {
            d <- cbind(rep(y, times = nrow(x)), x);
            names(d)[1] <- as.character(groups);
            return(d)}, 
        x = comp_list, 
        y = names(comp_list))
    
    res <- do.call(rbind, res)
    row.names(res) <- NULL
    return(res)
}
