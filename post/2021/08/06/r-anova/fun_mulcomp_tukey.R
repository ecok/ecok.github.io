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
    
    # 平均值 + 标准差
    res <- merge(cbind(treat = rownames(hsd$mean),
                       hsd$mean),
                 cbind(treat = rownames(hsd$groups),
                       hsd$groups),
                 sort = FALSE)
    return(res)
}

# 双因素组内比较

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

# 双因素、三因素至多因素组内比较

fun_mulcomp_hsd3 <- function(y, data, trts = trts, ...){
    
    lth <- length(trts)
    if(lth < 2) stop("Please set at least two factors")
    
    lvs <- lapply(trts, function(x) levels(data[,x]))
    names(lvs) <- trts
    
    cbn <- utils::combn(trts, lth - 1)
    egd <- vector(mode = "list", length = lth)
    facx <- vector(mode = "list", length = lth)
    
    for (i in 1:lth){
        egd[[i]] <- expand.grid(lvs[cbn[,i]])
        # names(egd)[i] <- paste0(
        #     toupper(substr(cbn[,i], 1, 2)),
        #     collapse = ".")
        facx[[i]] <- rep(base::setdiff(trts, cbn[,i]), nrow(egd[[i]]))
    }
    
    lst <- unlist(
        lapply(egd, 
            function(x) fun_sub_factors(data, x)),
        recursive = FALSE)
    
    res <- Map(function(d, fac, ...)
        fun_mulcomp_hsd(
            as.formula(paste0(y, " ~ ", fac)),
            d, ...),
        d = lst,
        fac = unlist(facx))
    
    return(res)
}

fun_sub_factors <- function(data, sub_egd){
    k <- nrow(sub_egd)
    ndf <- vector(mode = "list", length = k)

    for (i in 1:k){
        ndf[[i]] <- merge(data, sub_egd[i, , drop = FALSE])
        names(ndf)[i] <- paste(
            toupper(substr(colnames(sub_egd), 1, 2)),
            # as.character(unlist(sub_egd[i,])),
            as.matrix(sub_egd[i,]),
            sep = "_",
            collapse = ".")
    }
    
    return(ndf)
}
